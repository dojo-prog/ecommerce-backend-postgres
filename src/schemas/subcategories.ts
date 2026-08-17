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

export const SubcategoryNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Subcategory name is required" })
  .max(100, { message: "Subcategory name cannot exceed 100 characters" });

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

const SubcategoryEntitySchema = z.object({
  id: UUIDSchema,
  category_id: UUIDSchema,
  name: SubcategoryNameSchema,
  slug: SlugSchema,
  created_at: IsoDatetimeSchema,
});

// =======================================
// REQ QUERY SCHEMA
// =======================================

export const SubcategoryQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

export const SubcategoryBaseInputSchema = z.object({
  name: SubcategoryNameSchema,
});

export const CreateSubcategoryInputSchema = SubcategoryBaseInputSchema;

export const UpdateSubcategoryInputSchema = SubcategoryBaseInputSchema;

// =======================================
// RESULT SCHEMA
// =======================================

export const SubcategoryQueryResultSchema = z
  .object({
    subcategories: z.array(SubcategoryEntitySchema),
  })
  .extend({ pagination: PaginationResultSchema });

// =======================================
// TYPES
// =======================================

export type Subcategory = z.infer<typeof SubcategoryEntitySchema>;

export type SubcategoryQueryPayload = z.infer<typeof SubcategoryQuerySchema>;
export type CreateSubcategoryPayload = z.infer<
  typeof CreateSubcategoryInputSchema
>;
export type UpdateSubcategoryPayload = z.infer<
  typeof UpdateSubcategoryInputSchema
>;

export type SubcategoryQueryResult = z.infer<
  typeof SubcategoryQueryResultSchema
>;
