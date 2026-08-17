import { z } from "zod";
import {
  IsoDatetimeSchema,
  PaginationQuerySchema,
  PaginationResultSchema,
  SearchQuerySchema,
  SlugSchema,
  UUIDSchema,
} from "./common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const CategoryNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Category name is required" })
  .max(100, { message: "Category name cannot exceed 100 characters" });

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

const CategoryEntitySchema = z.object({
  id: UUIDSchema,
  name: CategoryNameSchema,
  slug: SlugSchema,
  created_at: IsoDatetimeSchema,
});

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const CategoryParamsSchema = z.object({
  categoryId: UUIDSchema,
});

// =======================================
// REQ QUERY SCHEMA
// =======================================

export const CategoryQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

const CategoryBaseInputSchema = z.object({
  name: CategoryNameSchema,
});

export const CreateCategoryInputSchema = CategoryBaseInputSchema;

export const UpdateCategoryInputSchema = CategoryBaseInputSchema;

// =======================================
// RESULT SCHEMA
// =======================================

export const CategoryQueryResultSchema = z
  .object({
    categories: z.array(CategoryEntitySchema),
  })
  .extend({ pagination: PaginationResultSchema });

// =======================================
// TYPES
// =======================================

export type Category = z.infer<typeof CategoryEntitySchema>;

export type CategoryQueryPayload = z.infer<typeof CategoryQuerySchema>;
export type CreateCategoryPayload = z.infer<typeof CreateCategoryInputSchema>;
export type UpdateCategoryPayload = z.infer<typeof UpdateCategoryInputSchema>;

export type CategoryQueryResult = z.infer<typeof CategoryQueryResultSchema>;
