import { Order, OrderQuery } from "../../schemas/orders";
import { GetResult, UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetUserOrdersParams {
  userId: string;
  filters: OrderQuery;
}

export interface GetUserOrderParams {
  userId: string;
  orderId: string;
}

export interface CheckoutParams {
  userId: string;
  addressId: string;
}

export interface CancelOrderParams {
  userId: string;
  orderId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateOrderData {
  user_id: string;
  subtotal_cents: number;
  tax_cents: number;
  shipping_fee_cents: number;
  shipping_distance_meters: number;
  total_cents: number;
}

// =======================================
// RESULT
// =======================================

export type GetOrdersResult = GetResult<"orders", Order>;

export type UpdateOrderStatusResult = UpdateResult<"order", Order>;
