import { z } from "zod";
import { AddressBaseInputSchema, AddressEntitySchema } from "./addresses";
import { UpdateResultSchema, UUIDSchema } from "./common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const StoreNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Store name is required" })
  .max(100, { message: "Store name cannot exceed 100 characters" });

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

export const StoreEntitySchema = AddressEntitySchema.omit({
  user_id: true,
}).extend({ name: StoreNameSchema });

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const StoreParamsSchema = z.object({
  storeId: UUIDSchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

const StoreBaseInputSchema = AddressBaseInputSchema.extend({
  name: StoreNameSchema,
});

export const CreateStoreInputSchema = StoreBaseInputSchema;
export const UpdateStoreInputSchema = StoreBaseInputSchema;

// =======================================
// RESULT SCHEMA
// =======================================

const UpdateStoreResultSchema = z.object({
  store: StoreEntitySchema,
  ...UpdateResultSchema.shape,
});

// =======================================
// TYPES
// =======================================

export type Store = z.infer<typeof StoreEntitySchema>;

export type CreateStorePayload = z.infer<typeof CreateStoreInputSchema>;
export type UpdateStorePayload = z.infer<typeof UpdateStoreInputSchema>;

export type UpdateStoreResult = z.infer<typeof UpdateStoreResultSchema>;
