import { Controller } from "../types/handlers";
import * as paymentService from "../services/payment.service";

export const payOrder: Controller = async (req, res, next) => {
  try {
    const order = await paymentService.payOrder({
      userId: req.user!.id,
      orderId: req.params.orderId as string,
      shouldFail: req.body?.shouldFail ?? false,
    });

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
    const payment = await paymentService.getPaymentByOrderId({
      orderId: req.params.orderId as string,
    });

    res.status(200).json({ success: true, data: { payment } });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById: Controller = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById({
      paymentId: req.params.paymentId as string,
    });

    res.status(200).json({ success: true, data: { payment } });
  } catch (error) {
    next(error);
  }
};
