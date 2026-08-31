import { z } from "zod";
import {
  PaginationQuerySchema,
  SearchQuerySchema,
  UUIDSchema,
} from "../common";
import { CartItemQuantitySchema } from ".";

// =======================================
// QUERY
// =======================================

export const CartItemQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// PARAMS
// =======================================

export const CartItemIdParamsSchema = z.object({
  cartItemId: UUIDSchema,
});

// =======================================
// BODY
// =======================================

export const AddToCartBodySchema = z.object({
  product_id: UUIDSchema,
  quantity: CartItemQuantitySchema.optional().default(1),
});

export const UpdateCartItemBodySchema = z.object({
  quantity: CartItemQuantitySchema,
});

// =======================================
// TYPES
// =======================================

export type CartItemQuery = z.infer<typeof CartItemQuerySchema>;

export type AddToCartBody = z.infer<typeof AddToCartBodySchema>;

export type UpdateCartItemBody = z.infer<typeof UpdateCartItemBodySchema>;
