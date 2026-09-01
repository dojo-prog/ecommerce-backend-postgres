import { PaymentStatus, PaymentProvider } from "../../schemas/payments";

// =======================================
// SERVICE PARAMS
// =======================================

export interface PayOrderParams {
  userId: string;
  orderId: string;
  shouldFail?: boolean;
}

export interface GetPaymentParams {
  paymentId: string;
}

export interface GetPaymentByOrderParams {
  orderId: string;
}

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
