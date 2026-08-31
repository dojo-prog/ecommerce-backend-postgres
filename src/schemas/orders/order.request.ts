import { z } from "zod";
import {
  PaginationQuerySchema,
  SearchQuerySchema,
  UUIDSchema,
} from "../common";
import { OrderStatusSchema } from "./order.schema";

// =======================================
// PARAMS
// =======================================

export const OrderIdParamsSchema = z.object({
  orderId: UUIDSchema,
});

// =======================================
// QUERY
// =======================================

export const OrderQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// BODY
// =======================================

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
});

// =======================================
// TYPES
// =======================================

export type OrderQueryPayload = z.infer<typeof OrderQuerySchema>;

export type UpdateOrderStatusBody = z.infer<typeof UpdateOrderStatusSchema>;
