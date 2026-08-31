import {
  CreateShippingBody,
  Shipping,
  UpdateShippingBody,
} from "../schemas/shippings";

import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";

import * as shippingRepository from "../repositories/shipping.repository";
import { UpdateShippingResult } from "../types/entities/shipping.types";

export const getShippingDetails = async () => {
  return await shippingRepository.find();
};

export const createShipping = async (
  payload: CreateShippingBody,
): Promise<Shipping> => {
  const existing = await shippingRepository.find();

  if (existing) {
    throw new AppError(400, "A shipping policy/rate has already been created");
  }

  return await shippingRepository.create(payload);
};

export const updateShipping = async (
  payload: UpdateShippingBody,
): Promise<UpdateShippingResult> => {
  const shipping = await shippingRepository.find();

  if (!shipping) {
    throw new AppError(400, "No shipping policy/rate has yet to be created");
  }

  const { old_values, new_values } = generateChanges(shipping, payload);

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
