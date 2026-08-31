import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import {
  CheckoutPayloadSchema,
  OrderParamsSchema,
  OrderQuerySchema,
} from "../schemas/orders";
import {
  checkout,
  getUserOrderById,
  getUserOrders,
} from "../controllers/order.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router.use(protectRoute);

router.get(
  "/",
  readLimiter,
  validate({ query: OrderQuerySchema }),
  getUserOrders,
);

router.post(
  "/checkout",
  writeLimiter,
  validate({ body: CheckoutPayloadSchema }),
  checkout,
);

router.get(
  "/:orderId",
  readLimiter,
  validate({ params: OrderParamsSchema }),
  getUserOrderById,
);

export default router;
