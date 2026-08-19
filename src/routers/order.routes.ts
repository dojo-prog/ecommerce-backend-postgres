import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { OrderParamsSchema } from "../schemas/orders";
import {
  checkout,
  getUserOrderById,
  getUserOrders,
} from "../controllers/order.controller";

const router = express.Router();

router.use(protectRoute);

router.get("/", getUserOrders);

router.post("/checkout", checkout);

router.get(
  "/:orderId",
  validate({ params: OrderParamsSchema }),
  getUserOrderById,
);

export default router;
