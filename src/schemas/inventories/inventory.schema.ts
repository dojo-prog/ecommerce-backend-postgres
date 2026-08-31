import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";

// =======================================
// ENTITY
// =======================================

const InventoryEntitySchema = z.object({
  product_id: UUIDSchema,
  quantity: NonNegativeIntSchema,
  updated_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type Inventory = z.infer<typeof InventoryEntitySchema>;
