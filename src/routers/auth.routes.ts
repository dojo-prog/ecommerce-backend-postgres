import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  authLimiter,
  readLimiter,
} from "../middlewares/rate.limit.middlewares";
import { LoginBodySchema, RegisterBodySchema } from "../schemas/auth";

const router = express.Router();

router.get("/me", readLimiter, protectRoute, getCurrentUser);
router.post(
  "/register",
  authLimiter,
  validate({ body: RegisterBodySchema }),
  register,
);
router.post("/login", authLimiter, validate({ body: LoginBodySchema }), login);
router.post("/logout", logout);
router.post("/refresh", authLimiter, refreshAccessToken);

export default router;
