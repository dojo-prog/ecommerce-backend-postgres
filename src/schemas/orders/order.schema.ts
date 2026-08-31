import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";
import { OrderItemEntitySchema } from "../order_items";

// =======================================
// ENUM
// =======================================

export const OrderStatusSchema = z.enum(
  ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
  { message: "Invalid order status" },
);

// =======================================
// ENTITY
// =======================================

const OrderEntitySchema = z.object({
  id: UUIDSchema,
  user_id: UUIDSchema,
  status: OrderStatusSchema,
  subtotal_cents: NonNegativeIntSchema,
  tax_cents: NonNegativeIntSchema,
  shipping_fee_cents: NonNegativeIntSchema,
  shipping_distance_meters: NonNegativeIntSchema,
  total_cents: NonNegativeIntSchema,
  paid_at: IsoDatetimeSchema.nullable(),
  processed_at: IsoDatetimeSchema.nullable(),
  shipped_at: IsoDatetimeSchema.nullable(),
  delivered_at: IsoDatetimeSchema.nullable(),
  cancelled_at: IsoDatetimeSchema.nullable(),
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

const OrderWithItemsSchema = OrderEntitySchema.omit({ user_id: true }).extend({
  items: z.array(OrderItemEntitySchema),
});

// =======================================
// TYPES
// =======================================

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export type Order = z.infer<typeof OrderEntitySchema>;

export type OrderWithItems = z.infer<typeof OrderWithItemsSchema>;
