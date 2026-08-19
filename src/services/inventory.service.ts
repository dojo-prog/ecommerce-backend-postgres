import { ProductRelations } from "../schemas/products";
import * as inventoryModel from "../models/inventory.model";
import { findById as findProductById } from "../models/product.model";
import AppError from "../utils/AppError";
import { Inventory } from "../schemas/inventory";

// =======================================
// EXPOSED SERVICE
// =======================================

export const addInventoryStock = async (
  productId: string,
  quantity: number,
): Promise<ProductRelations> => {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  let inventory = await inventoryModel.findById(productId);

  if (!inventory) {
    inventory = await inventoryModel.add(productId, 0);
  }

  await inventoryModel.update(productId, {
    quantity: inventory.quantity + quantity,
  });

  return await findProductById(productId);
};

export const updateProductInventory = async (
  productId: string,
  newQuantity: number,
): Promise<ProductRelations> => {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  let inventory = await inventoryModel.findById(productId);

  if (!inventory) {
    inventory = await inventoryModel.add(productId, 0);
  }

  await inventoryModel.update(productId, {
    quantity: newQuantity,
  });

  return await findProductById(productId);
};

export const getInventoryById = async (
  productId: string,
): Promise<Inventory> => {
  const inventory = await inventoryModel.findById(productId);

  if (!inventory) {
    throw new AppError(404, "Inventory not found");
  }

  return inventory;
};

// =======================================
// INTERNAL SERVICE
// =======================================

export const createInventory = async (
  productId: string,
  initQty: number = 0,
): Promise<void> => {
  await inventoryModel.add(productId, initQty);
};
