import express from "express";
import validate from "../middlewares/validation.middleware";
import { LoginInputSchema, RegisterInputSchema } from "../schemas/auth";
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

const router = express.Router();

router.get("/me", readLimiter, protectRoute, getCurrentUser);
router.post(
  "/register",
  authLimiter,
  validate({ body: RegisterInputSchema }),
  register,
);
router.post("/login", authLimiter, validate({ body: LoginInputSchema }), login);
router.post("/logout", logout);
router.post("/refresh", authLimiter, refreshAccessToken);

export default router;
