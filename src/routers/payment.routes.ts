import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { OrderParamsSchema } from "../schemas/orders";
import { PaymentParamsSchema } from "../schemas/payments";
import {
  getPaymentById,
  getPaymentByOrderId,
  payOrder,
} from "../controllers/payment.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router.use(protectRoute);

router
  .route("/orders/:orderId/payments")
  .get(
    readLimiter,
    validate({ params: OrderParamsSchema }),
    getPaymentByOrderId,
  )
  .post(writeLimiter, validate({ params: OrderParamsSchema }), payOrder);

router.get(
  "/payments/:paymentId",
  readLimiter,
  validate({ params: PaymentParamsSchema }),
  getPaymentById,
);

export default router;
