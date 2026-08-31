import { ProductWithRelations } from "../schemas/products";
import { findById as findProductById } from "../repositories/product.repository";
import AppError from "../utils/AppError";
import { Inventory } from "../schemas/inventories";

import * as inventoryRepository from "../repositories/inventory.repository";

// =======================================
// EXPOSED SERVICE
// =======================================

export const addInventoryStock = async (
  productId: string,
  quantity: number,
): Promise<ProductWithRelations> => {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  let inventory = await inventoryRepository.findById(productId);

  if (!inventory) {
    inventory = await inventoryRepository.add(productId, 0);
  }

  await inventoryRepository.update(productId, {
    quantity: inventory.quantity + quantity,
  });

  return await findProductById(productId);
};

export const updateProductInventory = async (
  productId: string,
  newQuantity: number,
): Promise<ProductWithRelations> => {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  let inventory = await inventoryRepository.findById(productId);

  if (!inventory) {
    inventory = await inventoryRepository.add(productId, 0);
  }

  if (inventory.quantity === newQuantity) {
    throw new AppError(400, `Inventory already contains ${newQuantity} units`);
  }

  await inventoryRepository.update(productId, {
    quantity: newQuantity,
  });

  return await findProductById(productId);
};

export const getInventoryById = async (
  productId: string,
): Promise<Inventory> => {
  const inventory = await inventoryRepository.findById(productId);

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
  await inventoryRepository.add(productId, initQty);
};
