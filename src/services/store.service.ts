import geocodeAddress from "../integrations/nominatim/geocoding";
import * as storeModel from "../models/store.model";
import {
  CreateStorePayload,
  Store,
  UpdateStorePayload,
  UpdateStoreResult,
} from "../schemas/stores";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";

export const getStoreDetails = async () => {
  return await storeModel.find();
};

export const createStore = async (
  payload: CreateStorePayload,
): Promise<Store> => {
  const existing = await storeModel.find();

  if (existing) {
    throw new AppError(400, "A store has already been created");
  }

  const { name, ...address } = payload;

  const { latitude, longitude } = await geocodeAddress(address);

  return await storeModel.create({ ...payload, latitude, longitude });
};

export const updateStore = async (
  payload: UpdateStorePayload,
): Promise<UpdateStoreResult> => {
  const store = await storeModel.find();

  if (!store) {
    throw new AppError(400, "No store has yet to be created");
  }

  const { name, ...address } = payload;

  const { latitude, longitude } = await geocodeAddress(address);

  const finalPayload = {
    ...payload,
    latitude,
    longitude,
  };

  const { old_values, new_values } = generateChanges(store, finalPayload);

  const updated = await storeModel.update(store.id, new_values);

  return {
    store: updated,
    old_values,
    new_values,
  };
};

export const deleteStore = async (): Promise<Store> => {
  const store = await storeModel.find();

  if (!store) {
    throw new AppError(400, "No store has yet to be created");
  }

  await storeModel.remove(store.id);

  return store;
};
