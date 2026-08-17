import { Response } from "express";
import { AUTH_TOKENS, BASE_COOKIE_OPTIONS } from "../../constants/auth";

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken?: string,
) => {
  const { ACCESS_TOKEN, REFRESH_TOKEN } = AUTH_TOKENS;

  res.cookie(ACCESS_TOKEN.name, accessToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN.cookieMaxAge,
  });

  if (refreshToken) {
    res.cookie(REFRESH_TOKEN.name, refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN.cookieMaxAge,
    });
  }
};

export default setAuthCookies;
