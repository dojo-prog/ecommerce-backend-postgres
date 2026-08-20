import { Controller } from "../types/handlers";
import * as paymentService from "../services/payment.service";

export const getPaymentByOrderId: Controller = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByOrderId(
      req.params.orderId as string,
    );

    res.status(200).json({ success: true, data: { payment } });
  } catch (error) {
    next(error);
  }
};
export const getPaymentById: Controller = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(
      req.params.paymentId as string,
    );

    res.status(200).json({ success: true, data: { payment } });
  } catch (error) {
    next(error);
  }
};
