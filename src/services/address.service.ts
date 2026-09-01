import { UserAddress } from "../schemas/addresses";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import geocodeAddress from "../integrations/nominatim/geocoding";
import {
  CreateAddressData,
  CreateAddressParams,
  DeleteAddressParams,
  GetAddressesParams,
  GetAddressParams,
  SetToDefaultParams,
  UpdateAddressParams,
  UpdateAddressResult,
} from "../types/entities/address.types";

import * as addressRepository from "../repositories/address.repository";

export const getUserAddresses = async (
  params: GetAddressesParams,
): Promise<UserAddress[]> => {
  const { userId } = params;

  return await addressRepository.find(userId);
};

export const createAddress = async (
  params: CreateAddressParams,
): Promise<UserAddress> => {
  const { userId, payload } = params;

  const addresses = await addressRepository.find(userId);

  if (addresses.length === 3) {
    throw new AppError(
      400,
      "The maximum of 3 addresses per user has been reached",
    );
  }

  const { latitude, longitude } = await geocodeAddress({
    ...payload,
    address_line: payload.addressLine,
  });

  const finalPayload: CreateAddressData = {
    ...payload,
    user_id: userId,
    address_line: payload.addressLine,
    latitude,
    longitude,
  };

  return await addressRepository.add(finalPayload);
};

export const getAddressById = async (
  params: GetAddressParams,
): Promise<UserAddress> => {
  const { userId, addressId } = params;

  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  return address;
};

export const updateAddress = async (
  params: UpdateAddressParams,
): Promise<UpdateAddressResult> => {
  const { userId, addressId, payload } = params;

  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  const { old_values, new_values } = generateChanges(address, {
    ...payload,
    address_line: payload.addressLine,
  });

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
  params: DeleteAddressParams,
): Promise<UserAddress> => {
  const { userId, addressId } = params;

  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  await addressRepository.remove(userId, addressId);

  return address;
};

export const setToDefault = async (params: SetToDefaultParams) => {
  const { userId, addressId } = params;

  const address = await addressRepository.findById(userId, addressId);

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  if (address.is_default) {
    throw new AppError(400, "Address already set to default");
  }

  return await addressRepository.setDefault(userId, addressId);
};
