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

const router = express.Router();

router.use(protectRoute);

router.get("/", validate({ query: OrderQuerySchema }), getUserOrders);

router.post("/checkout", validate({ body: CheckoutPayloadSchema }), checkout);

router.get(
  "/:orderId",
  validate({ params: OrderParamsSchema }),
  getUserOrderById,
);

export default router;
