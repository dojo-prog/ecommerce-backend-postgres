import { z } from "zod";
import { ImageUrlSchema, NonNegativeIntSchema, UUIDSchema } from "./common";
import { ProductNameSchema } from "./products";

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

export const OrderItemEntitySchema = z.object({
  id: UUIDSchema,
  order_id: UUIDSchema,
  product_id: UUIDSchema.nullable(),

  product_name: ProductNameSchema,
  product_thumbnail_url: ImageUrlSchema.nullable(),

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
  product_name: ProductNameSchema,
  product_thumbnail_url: ImageUrlSchema.optional().nullable(),
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
