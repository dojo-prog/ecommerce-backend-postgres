import { PoolClient } from "pg";
import * as orderItemModel from "../models/order_item.model";
import { CreateOrderItemPayload, OrderItem } from "../schemas/order_items";

export const createOrderItem = async (
  client: PoolClient,
  payload: CreateOrderItemPayload,
): Promise<void> => {
  await orderItemModel.add(client, payload);
};

export const getOrderItemsByOrderIds = async (
  orderIds: string[],
): Promise<OrderItem[]> => {
  return await orderItemModel.findByOrderIds(orderIds);
};

export const getOrderItemsByOrderId = async (
  orderId: string,
): Promise<OrderItem[]> => {
  return await orderItemModel.findByOrderId(orderId);
};
