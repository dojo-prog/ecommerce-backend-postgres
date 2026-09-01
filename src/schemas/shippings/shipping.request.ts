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
  baseFeeCents: DecimalSchema,
  feePerKmCents: DecimalSchema,
});

export const CreateShippingBodySchema = ShippingBaseBodySchema;

export const UpdateShippingBodySchema = ShippingBaseBodySchema;

// =======================================
// TYPES
// =======================================

export type CreateShippingBody = z.infer<typeof CreateShippingBodySchema>;

export type UpdateShippingBody = z.infer<typeof UpdateShippingBodySchema>;
