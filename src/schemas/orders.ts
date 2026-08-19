import { z } from "zod";
import {
  IsoDatetimeSchema,
  NonNegativeIntSchema,
  PaginationQuerySchema,
  PaginationResultSchema,
  SearchQuerySchema,
  UpdateResultSchema,
  UUIDSchema,
} from "./common";
import { OrderItemEntitySchema } from "./order_items";

// =======================================
// ENUM SCHEMA
// =======================================

export const OrderStatusSchema = z.enum(
  ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
  { message: "Invalid order status" },
);

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

const OrderEntitySchema = z.object({
  id: UUIDSchema,
  user_id: UUIDSchema,
  status: OrderStatusSchema,
  subtotal_cents: NonNegativeIntSchema,
  tax_cents: NonNegativeIntSchema,
  shipping_fee_cents: NonNegativeIntSchema,
  shipping_distance_meters: NonNegativeIntSchema,
  total_cents: NonNegativeIntSchema,
  timestamps: z.object({
    paid_at: IsoDatetimeSchema.nullable(),
    processed_at: IsoDatetimeSchema.nullable(),
    shipped_at: IsoDatetimeSchema.nullable(),
    delivered_at: IsoDatetimeSchema.nullable(),
    cancelled_at: IsoDatetimeSchema.nullable(),
  }),
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

const OrderWithItemsSchema = OrderEntitySchema.omit({ user_id: true }).extend({
  items: z.array(OrderItemEntitySchema),
});

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const OrderParamsSchema = z.object({
  orderId: UUIDSchema,
});

// =======================================
// REQ QUERY SCHEMA
// =======================================

export const OrderQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
});

// =======================================
// PAYLOAD SCHEMA
// =======================================

export const CheckoutPayloadSchema = z.object({
  address_id: UUIDSchema,
});

export const CreateOrderPayloadSchema = z.object({
  user_id: UUIDSchema,
  subtotal_cents: NonNegativeIntSchema,
  tax_cents: NonNegativeIntSchema,
  shipping_fee_cents: NonNegativeIntSchema,
  shipping_distance_meters: NonNegativeIntSchema,
  total_cents: NonNegativeIntSchema,
});

// =======================================
// RESULT SCHEMA
// =======================================

const OrderQueryResultSchema = z.object({
  orders: z.array(OrderEntitySchema),
  pagination: PaginationResultSchema,
});

const UpdateOrderStatusResultSchema = z.object({
  order: OrderEntitySchema,
  ...UpdateResultSchema.shape,
});

// =======================================
// TYPES
// =======================================

export type Order = z.infer<typeof OrderEntitySchema>;
export type OrderWithItems = z.infer<typeof OrderWithItemsSchema>;

export type OrderQueryPayload = z.infer<typeof OrderQuerySchema>;
export type CreateOrderPayload = z.infer<typeof CreateOrderPayloadSchema>;
export type UpdateOrderStatusPayload = z.infer<typeof UpdateOrderStatusSchema>;

export type OrderQueryResult = z.infer<typeof OrderQueryResultSchema>;
export type UpdateOrderStatusResult = z.infer<
  typeof UpdateOrderStatusResultSchema
>;
