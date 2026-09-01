import {
  CreateShippingBody,
  Shipping,
  UpdateShippingBody,
} from "../schemas/shippings";

import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";

import * as shippingRepository from "../repositories/shipping.repository";
import {
  CreateShippingData,
  CreateShippingParams,
  UpdateShippingParams,
  UpdateShippingResult,
} from "../types/entities/shipping.types";

export const getShippingDetails = async () => {
  return await shippingRepository.find();
};

export const createShipping = async (
  params: CreateShippingParams,
): Promise<Shipping> => {
  const { payload } = params;

  const existing = await shippingRepository.find();

  if (existing) {
    throw new AppError(400, "A shipping policy/rate has already been created");
  }

  const { baseFeeCents, feePerKmCents } = payload;

  const data: CreateShippingData = {
    ...payload,
    base_fee_cents: baseFeeCents,
    fee_per_km_cents: feePerKmCents,
  };

  return await shippingRepository.create(data);
};

export const updateShipping = async (
  params: UpdateShippingParams,
): Promise<UpdateShippingResult> => {
  const { payload } = params;

  const shipping = await shippingRepository.find();

  if (!shipping) {
    throw new AppError(400, "No shipping policy/rate has yet to be created");
  }

  const { baseFeeCents, feePerKmCents } = payload;

  const data: Partial<Shipping> = {
    ...payload,
    base_fee_cents: baseFeeCents,
    fee_per_km_cents: feePerKmCents,
  };

  const { old_values, new_values } = generateChanges(shipping, data);

  const updated = await shippingRepository.update(shipping.id, new_values);

  return {
    shipping: updated,
    old_values,
    new_values,
  };
};

export const deleteShipping = async (): Promise<Shipping> => {
  const shipping = await shippingRepository.find();

  if (!shipping) {
    throw new AppError(400, "No shipping policy/rate has yet to be created");
  }

  await shippingRepository.remove(shipping.id);

  return shipping;
};
