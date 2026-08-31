import { CreatePaymentPayload } from "../../schemas/payments";
import * as paymentModel from "../../repositories/payment.repository";

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

export default processPayment;
