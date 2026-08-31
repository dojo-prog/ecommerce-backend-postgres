import { z } from "zod";
import {
  NonNegativeIntSchema,
  PaginationQuerySchema,
  SearchQuerySchema,
  SlugSchema,
  UUIDSchema,
} from "../common";
import {
  CurrencySchema,
  IsActiveSchema,
  PriceCentsSchema,
  ProductAllowableSort,
  ProductDescriptionSchema,
  ProductNameSchema,
  WeightGramsSchema,
} from "./product.schema";

// =======================================
// PARAMS
// =======================================

export const ProductIdParamsSchema = z.object({
  productId: UUIDSchema,
});

// =======================================
// QUERY
// =======================================

export const ProductSpecificQuerySchema = z.object({
  category: SlugSchema.optional(),
  minPrice: NonNegativeIntSchema.optional(),
  maxPrice: NonNegativeIntSchema.optional(),
  inStock: z.coerce.boolean().optional(),
});

export const ProductQuerySchema = z
  .object({
    ...PaginationQuerySchema.shape,
    search: SearchQuerySchema,
    sort: ProductAllowableSort.optional(),
  })
  .merge(ProductSpecificQuerySchema);

// =======================================
// BODY
// =======================================

const ProductBaseBodySchema = z.object({
  subcategory_id: UUIDSchema,
  name: ProductNameSchema,
  description: ProductDescriptionSchema,
  price_cents: PriceCentsSchema,
  currency: CurrencySchema.optional().default("PHP"),
  weight_grams: WeightGramsSchema,
  is_active: IsActiveSchema.optional(),
  initial_quantity: NonNegativeIntSchema.optional(),
});

export const CreateProductBodySchema = ProductBaseBodySchema;

export const UpdateProductBodySchema = ProductBaseBodySchema;

// =======================================
// TYPES
// =======================================

export type ProductSpecificQuery = z.infer<typeof ProductSpecificQuerySchema>;

export type ProductQuery = z.infer<typeof ProductQuerySchema>;

export type CreateProductBody = z.infer<typeof CreateProductBodySchema>;

export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
