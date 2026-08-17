import { Controller } from "../types/handlers";
import * as authService from "../services/auth.service";
import { LoginPayload, RegisterPayload } from "../schemas/auth";
import setAuthCookies from "../utils/auth/setAuthCookies";
import { AUTH_TOKENS, BASE_COOKIE_OPTIONS } from "../constants/auth";

export const getCurrentUser: Controller = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const register: Controller = async (req, res, next) => {
  try {
    const { user, access_token, refresh_token } = await authService.register(
      req.body as RegisterPayload,
    );

    setAuthCookies(res, access_token, refresh_token);

    res
      .status(201)
      .json({ success: true, message: "Signup successful", data: { user } });
  } catch (error) {
    next(error);
  }
};

export const login: Controller = async (req, res, next) => {
  try {
    const { user, access_token, refresh_token } = await authService.login(
      req.body as LoginPayload,
    );

    setAuthCookies(res, access_token, refresh_token);

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: { user } });
  } catch (error) {
    next(error);
  }
};

export const logout: Controller = async (req, res, next) => {
  try {
    const { ACCESS_TOKEN, REFRESH_TOKEN } = AUTH_TOKENS;

    res.clearCookie(ACCESS_TOKEN.name, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN.cookieMaxAge,
    });
    res.clearCookie(REFRESH_TOKEN.name, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN.cookieMaxAge,
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken: Controller = async (req, res, next) => {
  try {
    const refresh_token = req.cookies[AUTH_TOKENS.REFRESH_TOKEN.name];

    const access_token = await authService.refreshAccessToken(refresh_token);

    setAuthCookies(res, access_token);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
