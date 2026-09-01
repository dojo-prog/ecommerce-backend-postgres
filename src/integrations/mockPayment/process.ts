import * as paymentModel from "../../repositories/payment.repository";
import { CreatePaymentData } from "../../types/entities/payment.types";

export const processPayment = async (
  orderId: string,
  amountCents: number,
  shouldFail = false,
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const payload: Partial<CreatePaymentData> = {
    order_id: orderId,
    amount_cents: amountCents,
    transaction_id: crypto.randomUUID(),
  };

  const { transaction_id } = payload;

  if (shouldFail) {
    payload.status = "failed";

    await paymentModel.create(payload as CreatePaymentData);

    return {
      success: false,
      transaction_id,
    };
  }

  payload.status = "successful";

  await paymentModel.create(payload as CreatePaymentData);

  return {
    success: true,
    transaction_id,
  };
};

export default processPayment;
