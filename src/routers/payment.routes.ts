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

const router = express.Router();

router.use(protectRoute);

router
  .route("/orders/:orderId/payments")
  .get(validate({ params: OrderParamsSchema }), getPaymentByOrderId)
  .post(validate({ params: OrderParamsSchema }), payOrder);

router.get(
  "/payments/:paymentId",
  validate({ params: PaymentParamsSchema }),
  getPaymentById,
);

export default router;
