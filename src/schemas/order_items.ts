import { z } from "zod";
import { NonNegativeIntSchema, UUIDSchema } from "./common";

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

const OrderItemEntitySchema = z.object({
  id: UUIDSchema,
  order_id: UUIDSchema,
  product_id: UUIDSchema,
  quantity: NonNegativeIntSchema.default(1),
  unit_price_cents: NonNegativeIntSchema,
  subtotal_cents: NonNegativeIntSchema,
});

// =======================================
// PAYLOAD SCHEMA
// =======================================

const CreateOrderItemPayloadSchema = z.object({
  order_id: UUIDSchema,
  product_id: UUIDSchema,
  quantity: NonNegativeIntSchema,
  unit_price_cents: NonNegativeIntSchema,
  subtotal_cents: NonNegativeIntSchema,
});

// =======================================
// TYPES
// =======================================

export type OrderItem = z.infer<typeof OrderItemEntitySchema>;

export type CreateOrderItemPayload = z.infer<
  typeof CreateOrderItemPayloadSchema
>;
