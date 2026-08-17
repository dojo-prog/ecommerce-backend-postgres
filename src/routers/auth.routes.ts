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

const router = express.Router();

router.get("/me", protectRoute, getCurrentUser);
router.post("/register", validate({ body: RegisterInputSchema }), register);
router.post("/login", validate({ body: LoginInputSchema }), login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);

export default router;
