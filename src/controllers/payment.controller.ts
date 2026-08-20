import { Controller } from "../types/handlers";
import * as paymentService from "../services/payment.service";

export const payOrder: Controller = async (req, res, next) => {
  try {
    const order = await paymentService.payOrder(
      req.user!.id,
      req.params.orderId as string,
      req.body?.shouldFail ?? false,
    );

    const success = order.status === "paid";

    res
      .status(201)
      .json({ success, message: `Order ${order.status}`, data: { order } });
  } catch (error) {
    next(error);
  }
};

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
