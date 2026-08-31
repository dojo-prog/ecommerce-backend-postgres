import { z } from "zod";
import { DecimalSchema, UUIDSchema } from "../common";
import { ShippingNameSchema } from "./shipping.schema";

// =======================================
// PARAMS
// =======================================

export const ShippingParamsSchema = z.object({
  shippingId: UUIDSchema,
});

// =======================================
// BODY
// =======================================

const ShippingBaseBodySchema = z.object({
  name: ShippingNameSchema,
  base_fee_cents: DecimalSchema,
  fee_per_km_cents: DecimalSchema,
});

export const CreateShippingBodySchema = ShippingBaseBodySchema;

export const UpdateShippingBodySchema = ShippingBaseBodySchema;

// =======================================
// TYPES
// =======================================

export type CreateShippingBody = z.infer<typeof CreateShippingBodySchema>;

export type UpdateShippingBody = z.infer<typeof UpdateShippingBodySchema>;
