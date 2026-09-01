import { UserAddress } from "../../schemas/addresses";
import { UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetAddressesParams {
  userId: string;
}

export interface GetAddressParams {
  userId: string;
  addressId: string;
}

export interface BaseAddressPayload {
  region: string;
  province: string;
  city: string;
  barangay: string;
  addressLine: string;
}

export interface CreateAddressParams {
  userId: string;
  payload: BaseAddressPayload;
}

export interface UpdateAddressParams {
  userId: string;
  addressId: string;
  payload: BaseAddressPayload;
}

export interface DeleteAddressParams {
  userId: string;
  addressId: string;
}

export interface SetToDefaultParams {
  userId: string;
  addressId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateAddressData {
  user_id: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  address_line: string;
  latitude: number;
  longitude: number;
}

// =======================================
// RESULT
// =======================================

export type UpdateAddressResult = UpdateResult<"address", UserAddress>;
