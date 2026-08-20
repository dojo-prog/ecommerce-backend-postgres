import * as paymentModel from "../models/payment.model";
import { CreatePaymentPayload, Payment } from "../schemas/payments";

export const processPayment = async (
  orderId: string,
  amountCents: number,
  shouldFail = false,
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const payload: Partial<CreatePaymentPayload> = {
    order_id: orderId,
    amount_cents: amountCents,
    transaction_id: crypto.randomUUID(),
  };

  const { transaction_id } = payload;

  if (shouldFail) {
    payload.status = "failed";

    await paymentModel.create(payload as CreatePaymentPayload);

    return {
      success: false,
      transaction_id,
    };
  }

  payload.status = "successful";

  await paymentModel.create(payload as CreatePaymentPayload);

  return {
    success: true,
    transaction_id,
  };
};
