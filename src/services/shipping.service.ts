import geocodeAddress from "../integrations/nominatim/geocoding";
import * as shippingModel from "../models/shipping.model";
import {
  CreateShippingPayload,
  Shipping,
  UpdateShippingPayload,
  UpdateShippingResult,
} from "../schemas/shipping";

import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";

export const getShippingDetails = async () => {
  return await shippingModel.find();
};

export const createShipping = async (
  payload: CreateShippingPayload,
): Promise<Shipping> => {
  const existing = await shippingModel.find();

  if (existing) {
    throw new AppError(400, "A shipping policy/rate has already been created");
  }

  return await shippingModel.create(payload);
};

export const updateShipping = async (
  payload: UpdateShippingPayload,
): Promise<UpdateShippingResult> => {
  const shipping = await shippingModel.find();

  if (!shipping) {
    throw new AppError(400, "No shipping policy/rate has yet to be created");
  }

  const { old_values, new_values } = generateChanges(shipping, payload);

  const updated = await shippingModel.update(shipping.id, new_values);

  return {
    shipping: updated,
    old_values,
    new_values,
  };
};

export const deleteShipping = async (): Promise<Shipping> => {
  const shipping = await shippingModel.find();

  if (!shipping) {
    throw new AppError(400, "No shipping policy/rate has yet to be created");
  }

  await shippingModel.remove(shipping.id);

  return shipping;
};
