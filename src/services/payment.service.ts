import { OrderWithItems } from "../schemas/orders";
import { Payment } from "../schemas/payments";
import AppError from "../utils/AppError";

import * as paymentModel from "../models/payment.model";
import * as orderModel from "../models/order.model";

import * as orderService from "../services/order.service";
import processPayment from "../integrations/mockPayment/process";

export const payOrder = async (
  userId: string,
  orderId: string,
  shouldFail = false,
): Promise<OrderWithItems> => {
  const order = await orderModel.findById(userId, orderId);

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.status !== "pending") {
    throw new AppError(400, "Only pending orders can be paid");
  }

  const payment = await processPayment(order.id, order.total_cents, shouldFail);

  if (!payment.success) {
    await orderService.cancelOrder(userId, orderId);

    throw new AppError(402, "Payment failed");
  }

  const updatedOrder = await orderModel.markAsPaid(orderId);

  return await orderService.getUserOrderById(userId, updatedOrder.id);
};

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<Payment> => {
  const payment = await paymentModel.findByOrderId(orderId);

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
};

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  const payment = await paymentModel.findById(paymentId);

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
};
