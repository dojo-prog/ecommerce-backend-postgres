import { z } from "zod";
import {
  IsoDatetimeSchema,
  PaginationQuerySchema,
  PaginationResultSchema,
  NonNegativeIntSchema,
  SearchQuerySchema,
  SlugSchema,
  UpdateResultSchema,
  UUIDSchema,
  ImageUrlSchema,
  ImagePublicIdSchema,
} from "./common";
import { CategoryNameSchema } from "./categories";
import { SubcategoryNameSchema } from "./subcategories";

// =======================================
// REUSABLE FIELDS
// =======================================

export const ProductNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Product name is required" })
  .max(100, { message: "Product name cannot exceed 100 characters" });

export const ProductDescriptionSchema = z
  .string()
  .trim()
  .min(1, { message: "Product description is required" })
  .max(1000, { message: "Product name cannot exceed 1000 characters" });

export const PriceCentsSchema = z.coerce
  .number()
  .int()
  .nonnegative({ message: "Product price cannot be less than 0" });

export const CurrencySchema = z
  .string()
  .trim()
  .length(3, { message: "Currency must be a 3-letter code" })
  .toUpperCase();

export const WeightGramsSchema = z.coerce
  .number()
  .int({ message: "Weight must be a whole number" })
  .nonnegative({ message: "Weight cannot be negative" });

export const IsActiveSchema = z.boolean().default(false);

// =======================================
// ENUM SCHEMA
// =======================================

export const ProductAllowableSort = z.enum([
  "name_asc",
  "name_desc",
  "price_asc",
  "price_desc",
  "newest",
  "oldest",
]);

// =======================================
// DATABASE ENTITY UNIT
// =======================================

export const ProductEntitySchema = z.object({
  id: UUIDSchema,
  subcategory_id: UUIDSchema,
  name: ProductNameSchema,
  description: ProductDescriptionSchema,
  price_cents: PriceCentsSchema,
  currency: CurrencySchema,
  weight_grams: WeightGramsSchema,
  thumbnail_url: ImageUrlSchema,
  thumbnail_public_id: ImagePublicIdSchema,
  is_active: IsActiveSchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

export const ProductRelationsSchema = ProductEntitySchema.omit({
  subcategory_id: true,
}).extend({
  category: z.object({
    id: UUIDSchema,
    name: CategoryNameSchema,
  }),
  subcategory: z.object({
    id: UUIDSchema,
    name: SubcategoryNameSchema,
  }),
  stock_quantity: NonNegativeIntSchema,
});

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const ProductParamsSchema = z.object({
  productId: UUIDSchema,
});

// =======================================
// REQ QUERY SCHEMA
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
// REQ BODY SCHEMA
// =======================================

const ProductBaseInputSchema = z.object({
  subcategory_id: UUIDSchema,
  name: ProductNameSchema,
  description: ProductDescriptionSchema,
  price_cents: PriceCentsSchema,
  currency: CurrencySchema.optional().default("PHP"),
  weight_grams: WeightGramsSchema,
  is_active: IsActiveSchema.optional(),
});

export const CreateProductInputSchema = ProductBaseInputSchema;

export const UpdateProductInputSchema = ProductBaseInputSchema;

// =======================================
// PAYLOAD SCHEMA
// =======================================

export const CreateProductFinalPayloadSchema = ProductBaseInputSchema.extend({
  thumbnail_url: ImageUrlSchema.optional(),
  thumbnail_public_id: ImagePublicIdSchema.optional(),
});

// =======================================
// RESULT SCHEMA
// =======================================

const ProductQueryResultSchema = z
  .object({
    products: z.array(ProductRelationsSchema),
  })
  .extend({ pagination: PaginationResultSchema });

const UpdateProductResultSchema = z
  .object({
    product: ProductRelationsSchema,
  })
  .merge(UpdateResultSchema);

// =======================================
// TYPES
// =======================================

export type Product = z.infer<typeof ProductEntitySchema>;
export type ProductRelations = z.infer<typeof ProductRelationsSchema>;

export type ProductSpecificQueryPayload = z.infer<
  typeof ProductSpecificQuerySchema
>;
export type ProductQueryPayload = z.infer<typeof ProductQuerySchema>;
export type CreateProductPayload = z.infer<typeof CreateProductInputSchema>;
export type UpdateProductPayload = z.infer<typeof UpdateProductInputSchema>;

export type CreateProductFinalPayload = z.infer<
  typeof CreateProductFinalPayloadSchema
>;

export type ProductQueryResult = z.infer<typeof ProductQueryResultSchema>;
export type UpdateProductResult = z.infer<typeof UpdateProductResultSchema>;
