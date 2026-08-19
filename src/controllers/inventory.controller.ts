import { Controller } from "../types/handlers";
import * as inventoryService from "../services/inventory.service";

export const addInventoryStock: Controller = async (req, res, next) => {
  try {
    const product = await inventoryService.addInventoryStock(
      req.params.productId as string,
      req.body.quantity,
    );

    res.status(200).json({
      success: true,
      message: `Added ${req.body.quantity} units to inventory`,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductInventory: Controller = async (req, res, next) => {
  try {
    const product = await inventoryService.updateProductInventory(
      req.params.productId as string,
      req.body.quantity,
    );

    res.status(200).json({
      success: true,
      message: "Product inventory updated",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryById: Controller = async (req, res, next) => {
  try {
    const inventory = await inventoryService.getInventoryById(
      req.params.productId as string,
    );

    res.status(200).json({ success: true, data: { inventory } });
  } catch (error) {
    next(error);
  }
};
