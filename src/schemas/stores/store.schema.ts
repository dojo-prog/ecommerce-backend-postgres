import { z } from "zod";
import { AddressEntitySchema } from "../addresses";

// =======================================
// REUSABLE FIELDS
// =======================================

export const StoreNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Store name is required" })
  .max(100, { message: "Store name cannot exceed 100 characters" });

// =======================================
// ENTITY
// =======================================

export const StoreEntitySchema = AddressEntitySchema.omit({
  user_id: true,
}).extend({ name: StoreNameSchema });

// =======================================
// TYPES
// =======================================

export type Store = z.infer<typeof StoreEntitySchema>;
