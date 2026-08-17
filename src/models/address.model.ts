import { CreateAddressPayload, UserAddress } from "../schemas/addresses";

export const find = async (userId: string) => {};
export const findById = async (userId: string, addressId: string) => {};
export const add = async (userId: string, payload: CreateAddressPayload) => {};
export const update = async (
  userId: string,
  addressId: string,
  changes: Partial<UserAddress>,
) => {};
export const remove = async (userId: string, addressId: string) => {};
