import { z } from "zod";
import { UUIDSchema } from "../common";
import { AddressBaseBodySchema } from "../addresses";
import { StoreNameSchema } from "./store.schema";

// =======================================
// PARAMS
// =======================================

export const StoreParamsSchema = z.object({
  storeId: UUIDSchema,
});

// =======================================
// BODY
// =======================================

const StoreBaseBodySchema = AddressBaseBodySchema.extend({
  name: StoreNameSchema,
});

export const CreateStoreBodySchema = StoreBaseBodySchema;

export const UpdateStoreBodySchema = StoreBaseBodySchema;

// =======================================
// TYPES
// =======================================

export type CreateStoreBody = z.infer<typeof CreateStoreBodySchema>;

export type UpdateStoreBody = z.infer<typeof UpdateStoreBodySchema>;
