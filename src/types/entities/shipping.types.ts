import { Shipping } from "../../schemas/shippings";
import { UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface BaseShippingPayload {
  name: string;
  baseFeeCents: number;
  feePerKmCents: number;
}

export interface CreateShippingParams {
  payload: BaseShippingPayload;
}

export interface UpdateShippingParams {
  payload: BaseShippingPayload;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateShippingData {
  name: string;
  base_fee_cents: number;
  fee_per_km_cents: number;
}

// =======================================
// RESULT
// =======================================

export type UpdateShippingResult = UpdateResult<"shipping", Shipping>;
