import { z } from "zod";
import { IsoDatetimeSchema, SlugSchema, UUIDSchema } from "../common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const CategoryNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Category name is required" })
  .max(100, { message: "Category name cannot exceed 100 characters" });

// =======================================
// ENTITY
// =======================================

const CategoryEntitySchema = z.object({
  id: UUIDSchema,
  name: CategoryNameSchema,
  slug: SlugSchema,
  created_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type Category = z.infer<typeof CategoryEntitySchema>;
