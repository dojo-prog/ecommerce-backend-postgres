import { Controller } from "../types/handlers";
import * as storeService from "../services/store.service";
import { CreateStoreBody, UpdateStoreBody } from "../schemas/stores";

export const getStoreDetails: Controller = async (req, res, next) => {
  try {
    const store = await storeService.getStoreDetails();

    res.status(200).json({ success: true, data: { store } });
  } catch (error) {
    next(error);
  }
};

export const createStore: Controller = async (req, res, next) => {
  try {
    const store = await storeService.createStore(req.body as CreateStoreBody);

    res
      .status(201)
      .json({ success: true, message: "Store created", data: { store } });
  } catch (error) {
    next(error);
  }
};

export const updateStore: Controller = async (req, res, next) => {
  try {
    const data = await storeService.updateStore(req.body as UpdateStoreBody);

    res.status(200).json({ success: true, message: "Store updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteStore: Controller = async (req, res, next) => {
  try {
    const store = await storeService.deleteStore();

    res
      .status(200)
      .json({ success: true, message: "Store deleted", data: { store } });
  } catch (error) {
    next(error);
  }
};
