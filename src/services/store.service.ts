import geocodeAddress from "../integrations/nominatim/geocoding";
import { CreateStoreBody, Store, UpdateStoreBody } from "../schemas/stores";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import {
  CreateStoreParams,
  UpdateStoreParams,
  UpdateStoreResult,
} from "../types/entities/store.types";

import * as storeRepository from "../repositories/store.repository";

export const getStoreDetails = async () => {
  return await storeRepository.find();
};

export const createStore = async (
  params: CreateStoreParams,
): Promise<Store> => {
  const { payload } = params;

  const existing = await storeRepository.find();

  if (existing) {
    throw new AppError(400, "A store has already been created");
  }

  const { name, ...address } = payload;

  const { latitude, longitude } = await geocodeAddress({
    ...address,
    address_line: address.addressLine,
  });

  return await storeRepository.create({ ...payload, latitude, longitude });
};

export const updateStore = async (
  params: UpdateStoreParams,
): Promise<UpdateStoreResult> => {
  const { payload } = params;

  const store = await storeRepository.find();

  if (!store) {
    throw new AppError(400, "No store has yet to be created");
  }

  const { name, ...address } = payload;

  const { latitude, longitude } = await geocodeAddress({
    ...address,
    address_line: address.addressLine,
  });

  const data: Partial<Store> = {
    ...payload,
    address_line: address.addressLine,
    latitude,
    longitude,
  };

  const { old_values, new_values } = generateChanges(store, data);

  const updated = await storeRepository.update(store.id, new_values);

  return {
    store: updated,
    old_values,
    new_values,
  };
};

export const deleteStore = async (): Promise<Store> => {
  const store = await storeRepository.find();

  if (!store) {
    throw new AppError(400, "No store has yet to be created");
  }

  await storeRepository.remove(store.id);

  return store;
};
