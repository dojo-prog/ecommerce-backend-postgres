import { z } from "zod";
import {
  ImagePublicIdSchema,
  ImageUrlSchema,
  IsoDatetimeSchema,
  NonNegativeIntSchema,
  UUIDSchema,
} from "../common";
import { CategoryNameSchema } from "../categories";
import { SubcategoryNameSchema } from "../subcategories";

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
// ENTITY
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

export const ProductWithRelationsSchema = ProductEntitySchema.omit({
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
// TYPES
// =======================================

export type Product = z.infer<typeof ProductEntitySchema>;

export type ProductWithRelations = z.infer<typeof ProductWithRelationsSchema>;
