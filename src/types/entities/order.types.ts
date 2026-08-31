import { Order } from "../../schemas/orders";
import { GetResult, UpdateResult } from "./common";

// =======================================
// REPOSITORY DATA
// =======================================

export interface CheckoutData {
  address_id: string;
}

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
