import { z } from "zod";
import { ImageUrlSchema, NonNegativeIntSchema, UUIDSchema } from "../common";
import { ProductNameSchema } from "../products";

// =======================================
// ENTITY
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
// TYPES
// =======================================

export type OrderItem = z.infer<typeof OrderItemEntitySchema>;
