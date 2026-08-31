import { z } from "zod";
import { UUIDSchema } from "../common";

// =======================================
// PARAMS
// =======================================

export const PaymentIdParamsSchema = z.object({
  paymentId: UUIDSchema,
});
