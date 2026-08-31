import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";
import { ProductWithRelationsSchema } from "../products";

// =======================================
// REUSABLE FIELDS
// =======================================

export const CartItemQuantitySchema = NonNegativeIntSchema.max(999, {
  message: "Cart quantity cannot exceed 999 ",
});

// =======================================
// ENTITY
// =======================================

export const CartItemsEntitySchema = z.object({
  cart_id: UUIDSchema,
  product_id: UUIDSchema,
  quantity: CartItemQuantitySchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

export const CartItemsWithRelationsSchema = z.object({
  product: ProductWithRelationsSchema,
  quantity: CartItemQuantitySchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type CartItem = z.infer<typeof CartItemsEntitySchema>;

export type CartItemWithRelations = z.infer<
  typeof CartItemsWithRelationsSchema
>;
