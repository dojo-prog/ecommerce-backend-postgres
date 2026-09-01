import { ProductWithRelations } from "../schemas/products";
import { findById as findProductById } from "../repositories/product.repository";
import AppError from "../utils/AppError";
import { Inventory } from "../schemas/inventories";
import {
  AddInventoryStockParams,
  GetProductInventoryParams,
  UpdateProductInventoryParams,
} from "../types/entities/inventory.types";

import * as inventoryRepository from "../repositories/inventory.repository";

// =======================================
// EXPOSED SERVICE
// =======================================

export const addInventoryStock = async (
  params: AddInventoryStockParams,
): Promise<ProductWithRelations> => {
  const { productId, quantity } = params;

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
  params: UpdateProductInventoryParams,
): Promise<ProductWithRelations> => {
  const { productId, newQuantity } = params;

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
  params: GetProductInventoryParams,
): Promise<Inventory> => {
  const { productId } = params;

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
