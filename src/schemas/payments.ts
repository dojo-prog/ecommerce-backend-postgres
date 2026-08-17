import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "./common";

// =======================================
// REUSABLE FIELDS SCHEMA
// =======================================

export const TransactionIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Transaction ID is required" })
  .max(100, { message: "Transaction ID cannot exceed 100 characters" });

// =======================================
// ENUM SCHEMA
// =======================================

export const PaymentStatusSchema = z.enum(
  ["pending", "successful", "failed", "refunded"],
  { message: "Invalid payment status" },
);

export const PaymentProviderSchema = z.enum(["mock"], {
  message: "Invalid / Unregistered payment provider",
});

// =======================================
// DATABASE ENTITY SCHEMA
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
// REQ PARAMS SCHEMA
// =======================================

export const PaymentParamsSchema = z.object({
  paymentId: UUIDSchema,
});

// =======================================
// PAYLOAD SCHEMA
// =======================================

export const CreatePaymentPayloadSchema = z.object({
  order_id: UUIDSchema,
  amount_cents: NonNegativeIntSchema,
  status: PaymentStatusSchema,
  provider: PaymentProviderSchema,
  transaction_id: TransactionIdSchema,
});

// =======================================
// TYPES
// =======================================

export type Payment = z.infer<typeof PaymentEntitySchema>;

export type CreatePaymentPayload = z.infer<typeof CreatePaymentPayloadSchema>;
