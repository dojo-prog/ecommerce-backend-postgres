import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { OrderIdParamsSchema } from "../schemas/orders";
import { PaymentIdParamsSchema } from "../schemas/payments";
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
    validate({ params: OrderIdParamsSchema }),
    getPaymentByOrderId,
  )
  .post(writeLimiter, validate({ params: OrderIdParamsSchema }), payOrder);

router.get(
  "/payments/:paymentId",
  readLimiter,
  validate({ params: PaymentIdParamsSchema }),
  getPaymentById,
);

export default router;
