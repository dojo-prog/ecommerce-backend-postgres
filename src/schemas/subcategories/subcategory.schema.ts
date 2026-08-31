import { z } from "zod";
import { IsoDatetimeSchema, SlugSchema, UUIDSchema } from "../common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const SubcategoryNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Subcategory name is required" })
  .max(100, { message: "Subcategory name cannot exceed 100 characters" });

// =======================================
// ENTITY
// =======================================

const SubcategoryEntitySchema = z.object({
  id: UUIDSchema,
  category_id: UUIDSchema,
  name: SubcategoryNameSchema,
  slug: SlugSchema,
  created_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type Subcategory = z.infer<typeof SubcategoryEntitySchema>;
