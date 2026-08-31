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

export type CreateInventoryBody = z.infer<typeof CreateInventoryBodySchema>;

export type AddStockToInventoryBody = z.infer<
  typeof AddStockToInventoryBodySchema
>;

export type UpdateInventoryBody = z.infer<typeof UpdateInventoryBodySchema>;
