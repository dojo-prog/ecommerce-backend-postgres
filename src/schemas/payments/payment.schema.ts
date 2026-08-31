import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";

// =======================================
// REUSABLE FIELDS SCHEMA
// =======================================

export const TransactionIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Transaction ID is required" })
  .max(100, { message: "Transaction ID cannot exceed 100 characters" });

// =======================================
// ENUM
// =======================================

export const PaymentStatusSchema = z.enum(
  ["pending", "successful", "failed", "refunded"],
  { message: "Invalid payment status" },
);

export const PaymentProviderSchema = z.enum(["mock"], {
  message: "Invalid / Unregistered payment provider",
});

// =======================================
// ENTITY
// =======================================

const PaymentEntitySchema = z.object({
  id: UUIDSchema,
  order_id: UUIDSchema,
  amount_cents: NonNegativeIntSchema,
  status: PaymentStatusSchema,
  provider: PaymentProviderSchema,
  transaction_id: TransactionIdSchema,
  created_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;

export type Payment = z.infer<typeof PaymentEntitySchema>;
