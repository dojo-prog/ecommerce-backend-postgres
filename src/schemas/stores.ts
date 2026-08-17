import { z } from "zod";
import { AddressBaseInputSchema, AddressEntitySchema } from "./addresses";
import { UpdateResultSchema, UUIDSchema } from "./common";

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

export const StoreEntitySchema = AddressEntitySchema.omit({
  user_id: true,
}).extend({ main: z.boolean().default(false) });

// =======================================
// REQ PARAMS SCHEMA
// =======================================

export const StoreParamsSchema = z.object({
  storeId: UUIDSchema,
});

// =======================================
// REQ BODY SCHEMA
// =======================================

const StoreBaseInputSchema = AddressBaseInputSchema;

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
