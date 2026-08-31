import { PaymentStatus, PaymentProvider } from "../../schemas/payments";

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreatePaymentData {
  order_id: string;
  amount_cents: number;
  status: PaymentStatus;
  provider: PaymentProvider;
  transaction_id: string;
}
