import { z } from "zod";
import {
  PaginationQuerySchema,
  SearchQuerySchema,
  SlugSchema,
  UUIDSchema,
} from "../common";
import { CategoryNameSchema } from "./category.schema";

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const CategorySlugParamsSchema = z.object({
  categorySlug: SlugSchema,
});

export const CategoryIdParamsSchema = z.object({
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

const CategoryBaseBodySchema = z.object({
  name: CategoryNameSchema,
});

export const CreateCategoryBodySchema = CategoryBaseBodySchema;

export const UpdateCategoryBodySchema = CategoryBaseBodySchema;

// =======================================
// TYPES
// =======================================

export type CategoryQuery = z.infer<typeof CategoryQuerySchema>;

export type CreateCategoryBody = z.infer<typeof CreateCategoryBodySchema>;

export type UpdateCategoryBody = z.infer<typeof UpdateCategoryBodySchema>;
