import {
  CreateAddressPayload,
  UpdateAddressPayload,
  UpdateAddressResult,
  UserAddress,
} from "../schemas/addresses";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import geocodeAddress from "../integrations/nominatim/geocoding";

import * as addressRepository from "../repositories/address.repository";

export const getUserAddresses = async (
  userId: string,
): Promise<UserAddress[]> => {
  return await addressRepository.find(userId);
};

export const createAddress = async (
  userId: string,
  payload: CreateAddressPayload,
): Promise<UserAddress> => {
  const addresses = await addressRepository.find(userId);

  if (addresses.length === 3) {
    throw new AppError(
      400,
      "The maximum of 3 addresses per user has been reached",
    );
  }

  const { latitude, longitude } = await geocodeAddress(payload);

  const finalPayload = {
    user_id: userId,
    ...payload,
    latitude,
    longitude,
  };

  return await addressRepository.add(finalPayload);
};

export const getAddressById = async (
  userId: string,
  addressId: string,
): Promise<UserAddress> => {
  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  return address;
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  payload: UpdateAddressPayload,
): Promise<UpdateAddressResult> => {
  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  const { old_values, new_values } = generateChanges(address, payload);

  const modifiedAddress = {
    ...address,
    ...new_values,
  };

  const { latitude, longitude } = await geocodeAddress(modifiedAddress);

  new_values.latitude = latitude;
  new_values.longitude = longitude;

  const updated = await addressRepository.update(userId, addressId, new_values);

  return {
    address: updated,
    old_values,
    new_values,
  };
};

export const deleteAddress = async (
  userId: string,
  addressId: string,
): Promise<UserAddress> => {
  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  await addressRepository.remove(userId, addressId);

  return address;
};

export const setToDefault = async (userId: string, addressId: string) => {
  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  if (address.is_default) {
    throw new AppError(400, "Address already set to default");
  }

  return await addressRepository.setDefault(userId, addressId);
};
