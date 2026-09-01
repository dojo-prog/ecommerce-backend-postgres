import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth/generateAuthTokens";
import ENV from "../config/env";
import { getOrCreateCart } from "../services/cart.service";
import {
  LoginParams,
  LoginResult,
  RefreshAccessTokenParams,
  RefreshTokenPayload,
  RegisterData,
  RegisterParams,
  RegisterResult,
} from "../types/entities/auth.types";

import * as authRepository from "../repositories/auth.repository";

export const register = async (
  params: RegisterParams,
): Promise<RegisterResult> => {
  const { username, email, password } = params;

  const existingUsername = await authRepository.findByUsername(username);

  if (existingUsername) {
    throw new AppError(400, "Username already used");
  }

  const existingEmail = await authRepository.findByEmail(email);

  if (existingEmail) {
    throw new AppError(400, "Email already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const finalPayload: RegisterData = {
    username,
    email,
    password_hash,
  };

  const user = await authRepository.register(finalPayload);

  await getOrCreateCart(user.id);

  return {
    user,
    access_token: generateAccessToken(user.id, user.role),
    refresh_token: generateRefreshToken(user.id),
  };
};

export const login = async (params: LoginParams): Promise<LoginResult> => {
  const { email, password } = params;

  const user = await authRepository.findPrivateByEmail(email);

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
  params: RefreshAccessTokenParams,
): Promise<string> => {
  const { refreshToken } = params;

  if (!refreshToken) {
    throw new AppError(401, "Unauthorized - Session Expired");
  }

  let decoded: RefreshTokenPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN_SECRET,
    ) as RefreshTokenPayload;
  } catch (error) {
    throw new AppError(401, "Unauthorized");
  }

  if (!decoded.id) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await authRepository.findById(decoded.id);

  if (!user) {
    throw new AppError(401, "Unauthorized");
  }

  return generateAccessToken(user.id, user.role);
};
