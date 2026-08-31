import { OrderWithItems } from "../schemas/orders";
import { Payment } from "../schemas/payments";
import AppError from "../utils/AppError";
import processPayment from "../integrations/mockPayment/process";

import * as paymentRepository from "../repositories/payment.repository";
import * as orderRepository from "../repositories/order.repository";

import * as orderService from "../services/order.service";

export const payOrder = async (
  userId: string,
  orderId: string,
  shouldFail = false,
): Promise<OrderWithItems> => {
  const order = await orderRepository.findById(userId, orderId);

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

  const updatedOrder = await orderRepository.markAsPaid(orderId);

  return await orderService.getUserOrderById(userId, updatedOrder.id);
};

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<Payment> => {
  const payment = await paymentRepository.findByOrderId(orderId);

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
};

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  const payment = await paymentRepository.findById(paymentId);

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
};
