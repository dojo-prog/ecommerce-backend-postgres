import jwt from "jsonwebtoken";
import {
  LoginPayload,
  LoginServiceResult,
  RefreshTokenPayload,
  RegisterPayload,
  RegisterServiceResult,
} from "../schemas/auth";
import * as authModel from "../models/auth.model";
import AppError from "../utils/AppError";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth/generateAuthTokens";
import ENV from "../config/env";
import { getOrCreateCart } from "../services/cart.service";

export const register = async (
  payload: RegisterPayload,
): Promise<RegisterServiceResult> => {
  const { username, email, password } = payload;

  const existingUsername = await authModel.findByUsername(username);

  if (existingUsername) {
    throw new AppError(400, "Username already used");
  }

  const existingEmail = await authModel.findByEmail(email);

  if (existingEmail) {
    throw new AppError(400, "Email already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const finalPayload = {
    username,
    email,
    password_hash,
  };

  const user = await authModel.register(finalPayload);

  await getOrCreateCart(user.id);

  return {
    user,
    access_token: generateAccessToken(user.id, user.role),
    refresh_token: generateRefreshToken(user.id),
  };
};

export const login = async (
  payload: LoginPayload,
): Promise<LoginServiceResult> => {
  const { email, password } = payload;

  const user = await authModel.findPrivateByEmail(email);

  if (!user) {
    throw new AppError(400, "Invalid email or password");
  }

  const correctPassword = await bcrypt.compare(password, user.password_hash);

  if (!correctPassword) {
    throw new AppError(400, "Invalid email or password");
  }

  const { password_hash, ...publicUser } = user;

  return {
    user: publicUser,
    access_token: generateAccessToken(user.id, user.role),
    refresh_token: generateRefreshToken(user.id),
  };
};

export const refreshAccessToken = async (
  refresh_token: string,
): Promise<string> => {
  if (!refresh_token) {
    throw new AppError(401, "Unauthorized - Session Expired");
  }

  let decoded: RefreshTokenPayload;

  try {
    decoded = jwt.verify(
      refresh_token,
      ENV.REFRESH_TOKEN_SECRET,
    ) as RefreshTokenPayload;
  } catch (error) {
    throw new AppError(401, "Unauthorized");
  }

  if (!decoded.id) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await authModel.findById(decoded.id);

  if (!user) {
    throw new AppError(401, "Unauthorized");
  }

  return generateAccessToken(user.id, user.role);
};
