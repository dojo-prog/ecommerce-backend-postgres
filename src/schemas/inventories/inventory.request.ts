import { z } from "zod";
import { NonNegativeIntSchema, UUIDSchema } from "../common";

// =======================================
// BODY
// =======================================

export const CreateInventoryInputSchema = z.object({
  product_id: UUIDSchema,
  quantity: NonNegativeIntSchema.default(0),
});

export const AddStockToInventoryInputSchema = z.object({
  quantity: NonNegativeIntSchema,
});

export const UpdateInventoryInputSchema = z.object({
  quantity: NonNegativeIntSchema,
});

// =======================================
// TYPES
// =======================================

export type CreateInventoryPayload = z.infer<typeof CreateInventoryInputSchema>;

export type AddStockToInventoryPayload = z.infer<
  typeof AddStockToInventoryInputSchema
>;

export type UpdateInventoryPayload = z.infer<typeof UpdateInventoryInputSchema>;
