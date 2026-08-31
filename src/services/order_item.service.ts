import { PoolClient } from "pg";
import { OrderItem } from "../schemas/order_items";

import * as orderItemRepository from "../repositories/order_item.repository";
import { CreateOrderItemData } from "../types/entities/order_item.types";

export const createOrderItem = async (
  client: PoolClient,
  payload: CreateOrderItemData,
): Promise<void> => {
  await orderItemRepository.add(client, payload);
};

export const getOrderItemsByOrderIds = async (
  orderIds: string[],
): Promise<OrderItem[]> => {
  return await orderItemRepository.findByOrderIds(orderIds);
};

export const getOrderItemsByOrderId = async (
  orderId: string,
): Promise<OrderItem[]> => {
  return await orderItemRepository.findByOrderId(orderId);
};
