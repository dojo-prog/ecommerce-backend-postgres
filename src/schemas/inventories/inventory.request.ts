import { z } from "zod";
import { NonNegativeIntSchema, UUIDSchema } from "../common";

// =======================================
// BODY
// =======================================

export const CreateInventoryBodySchema = z.object({
  product_id: UUIDSchema,
  quantity: NonNegativeIntSchema.default(0),
});

export const AddStockToInventoryBodySchema = z.object({
  quantity: NonNegativeIntSchema,
});

export const UpdateInventoryBodySchema = z.object({
  quantity: NonNegativeIntSchema,
});

// =======================================
// TYPES
// =======================================

export type CreateInventoryPayload = z.infer<typeof CreateInventoryBodySchema>;

export type AddStockToInventoryPayload = z.infer<
  typeof AddStockToInventoryBodySchema
>;

export type UpdateInventoryPayload = z.infer<typeof UpdateInventoryBodySchema>;
