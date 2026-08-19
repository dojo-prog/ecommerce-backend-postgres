import { z } from "zod";
import {
  IsoDatetimeSchema,
  PaginationQuerySchema,
  PaginationResultSchema,
  NonNegativeIntSchema,
  UUIDSchema,
  SearchQuerySchema,
} from "./common";
import { CategoryNameSchema } from "./categories";
import { SubcategoryNameSchema } from "./subcategories";
import {
  IsActiveSchema,
  PriceCentsSchema,
  ProductDescriptionSchema,
  ProductNameSchema,
  ProductRelationsSchema,
} from "./products";

// =======================================
// REUSABLE FIELDS
// =======================================

export const CartItemQuantitySchema = NonNegativeIntSchema.max(999, {
  message: "Cart quantity cannot exceed 999 ",
});

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

export const CartItemsEntitySchema = z.object({
  cart_id: UUIDSchema,
  product_id: UUIDSchema,
  quantity: CartItemQuantitySchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

export const CartItemsRelationsSchema = z.object({
  product: ProductRelationsSchema,
  quantity: CartItemQuantitySchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

// =======================================
// REQ QUERY SCHEMA
// =======================================

export const CartItemQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const CartItemParamsSchema = z.object({
  cartItemId: UUIDSchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

export const AddToCartInputSchema = z.object({
  product_id: UUIDSchema,
  quantity: CartItemQuantitySchema.optional().default(1),
});

export const UpdateCartItemInputSchema = z.object({
  quantity: CartItemQuantitySchema,
});

// =======================================
// RESULTS SCHEMA
// =======================================

export const CartItemQueryResultSchema = z.object({
  cart_items: z.array(CartItemsRelationsSchema),
  pagination: PaginationResultSchema,
});

// =======================================
// TYPES
// =======================================

export type CartItem = z.infer<typeof CartItemsEntitySchema>;
export type CartItemRelations = z.infer<typeof CartItemsRelationsSchema>;

export type CartItemQueryPayload = z.infer<typeof CartItemQuerySchema>;
export type AddToCartPayload = z.infer<typeof AddToCartInputSchema>;
export type UpdateCartItemPayload = z.infer<typeof UpdateCartItemInputSchema>;

export type CartItemQueryResult = z.infer<typeof CartItemQueryResultSchema>;
