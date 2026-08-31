import { z } from "zod";
import { IsoDatetimeSchema, UUIDSchema } from "../common";

// =======================================
// ENTITY
// =======================================

export const CartEntitySchema = z.object({
  id: UUIDSchema,
  user_id: UUIDSchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type Cart = z.infer<typeof CartEntitySchema>;
