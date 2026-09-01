import { Store } from "../../schemas/stores";
import { BaseAddressPayload } from "./address.types";
import { UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface BaseStorePayload extends BaseAddressPayload {
  name: string;
}

export interface CreateStoreParams {
  payload: BaseStorePayload;
}

export interface UpdateStoreParams {
  payload: BaseStorePayload;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateStoreData {
  name: string;
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

export type UpdateStoreResult = UpdateResult<"store", Store>;
