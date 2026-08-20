import { OrderWithItems } from "../schemas/orders";
import { CreatePaymentPayload, Payment } from "../schemas/payments";
import AppError from "../utils/AppError";

import * as paymentModel from "../models/payment.model";
import * as orderModel from "../models/order.model";

import * as orderService from "../services/order.service";

export const processPayment = async (
  orderId: string,
  amountCents: number,
  shouldFail = false,
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const payload: Partial<CreatePaymentPayload> = {
    order_id: orderId,
    amount_cents: amountCents,
    transaction_id: crypto.randomUUID(),
  };

  const { transaction_id } = payload;

  if (shouldFail) {
    payload.status = "failed";

    await paymentModel.create(payload as CreatePaymentPayload);

    return {
      success: false,
      transaction_id,
    };
  }

  payload.status = "successful";

  await paymentModel.create(payload as CreatePaymentPayload);

  return {
    success: true,
    transaction_id,
  };
};

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
