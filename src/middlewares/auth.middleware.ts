import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../schemas/auth";
import AppError from "../utils/AppError";
import ENV from "../config/env";
import { Middleware } from "../types/handlers";
import pool from "../database/db";
import { UserRole } from "../schemas/users";
import { AUTH_TOKENS } from "../constants/auth";
import { USER_PUBLIC_PROJECTION } from "../database/queries/users";

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

  const { rows } = await pool.query(
    `
    SELECT ${USER_PUBLIC_PROJECTION}
    FROM users 
    WHERE id = $1
    `,
    [decoded.id],
  );

  const user = rows[0];

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
