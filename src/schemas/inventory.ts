import { z } from "zod";
import {
  IsoDatetimeSchema,
  NonNegativeIntSchema,
  UpdateResultSchema,
  UUIDSchema,
} from "./common";

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

const InventoryEntitySchema = z.object({
  product_id: UUIDSchema,
  quantity: NonNegativeIntSchema,
  updated_at: IsoDatetimeSchema,
});

// =======================================
// REQ BODY SCHEMA
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
// RESULT SCHEMA
// =======================================

const UpdateInventoryResultSchema = z.object({
  inventory: InventoryEntitySchema,
  ...UpdateResultSchema.shape,
});

// =======================================
// TYPES
// =======================================

export type Inventory = z.infer<typeof InventoryEntitySchema>;

export type CreateInventoryPayload = z.infer<typeof CreateInventoryInputSchema>;
export type AddStockToInventoryPayload = z.infer<
  typeof AddStockToInventoryInputSchema
>;
export type UpdateInventoryPayload = z.infer<typeof UpdateInventoryInputSchema>;

export type UpdateInventoryResult = z.infer<typeof UpdateInventoryResultSchema>;
