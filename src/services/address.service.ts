import {
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../schemas/addresses";

export const getUserAddresses = async (userId: string) => {};
export const createAddress = async (
  userId: string,
  payload: CreateAddressPayload,
) => {};
export const getAddressById = async (userId: string, addressId: string) => {};
export const updateAddress = async (
  userId: string,
  addressId: string,
  payload: UpdateAddressPayload,
) => {};
export const deleteAddress = async (userId: string, addressId: string) => {};
