import { z } from "zod";
import {
  DecimalSchema,
  NonNegativeIntSchema,
  UpdateResultSchema,
  UUIDSchema,
} from "./common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const ShippingNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Shipping name is required" })
  .max(100, { message: "Shipping name cannot exceed 100 characters" });

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

const ShippingEntitySchema = z.object({
  id: UUIDSchema,
  name: ShippingNameSchema,
  base_fee_cents: NonNegativeIntSchema.default(0),
  fee_per_km_cents: NonNegativeIntSchema.default(0),
});

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const ShippingParamsSchema = z.object({
  shippingId: UUIDSchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

const ShippingBaseInputSchema = z.object({
  name: ShippingNameSchema,
  base_fee_cents: DecimalSchema,
  fee_per_km_cents: DecimalSchema,
});

export const CreateShippingInputSchema = ShippingBaseInputSchema;
export const UpdateShippingInputSchema = ShippingBaseInputSchema;

// =======================================
// RESULTS
// =======================================

export const UpdateShippingResultSchema = z.object({
  shipping: ShippingEntitySchema,
  ...UpdateResultSchema.shape,
});

// =======================================
// TYPES
// =======================================

export type Shipping = z.infer<typeof ShippingEntitySchema>;

export type CreateShippingPayload = z.infer<typeof CreateShippingInputSchema>;
export type UpdateShippingPayload = z.infer<typeof UpdateShippingInputSchema>;

export type UpdateShippingResult = z.infer<typeof UpdateShippingResultSchema>;
