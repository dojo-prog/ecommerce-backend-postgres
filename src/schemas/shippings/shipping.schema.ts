import { z } from "zod";
import { NonNegativeIntSchema, UUIDSchema } from "../common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const ShippingNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Shipping name is required" })
  .max(100, { message: "Shipping name cannot exceed 100 characters" });

// =======================================
// ENTITY
// =======================================

const ShippingEntitySchema = z.object({
  id: UUIDSchema,
  name: ShippingNameSchema,
  base_fee_cents: NonNegativeIntSchema.default(0),
  fee_per_km_cents: NonNegativeIntSchema.default(0),
});

// =======================================
// TYPES
// =======================================

export type Shipping = z.infer<typeof ShippingEntitySchema>;
