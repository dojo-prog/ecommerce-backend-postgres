import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import ENV from "../config/env";
import { Middleware } from "../types/handlers";
import { UserRole } from "../schemas/users";
import { AUTH_TOKENS } from "../constants/auth";
import { AccessTokenPayload } from "../types/entities/auth.types";

import * as authRepository from "../repositories/auth.repository";

const protectRoute: Middleware = async (req, res, next) => {
  const access_token = req.cookies[AUTH_TOKENS.ACCESS_TOKEN.name];

  if (!access_token) {
    return next(new AppError(401, "Unauthorized"));
  }

  let decoded: AccessTokenPayload;

  try {
    decoded = jwt.verify(
      access_token,
      ENV.ACCESS_TOKEN_SECRET,
    ) as AccessTokenPayload;
  } catch (error) {
    return next(new AppError(401, "Unauthorized"));
  }

  const user = await authRepository.findById(decoded.id);

  if (!user) {
    return next(new AppError(401, "Unauthorized"));
  }

  req.user = user;

  next();
};

export const authorizeRoles = (roles: UserRole[]): Middleware => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (!roles.includes(user.role)) {
      return next(
        new AppError(
          403,
          "You don't have the permission to access this resource",
        ),
      );
    }

    next();
  };
};

export { protectRoute };
