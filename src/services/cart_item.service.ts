import { CartItemWithRelations } from "../schemas/cart_items";
import AppError from "../utils/AppError";
import {
  AddToCartParams,
  GetCartItemParams,
  GetCartItemsParams,
  GetCartItemsResult,
  RemoveFromCartParams,
  UpdateItemQuantityParams,
} from "../types/entities/cart_item.types";

import * as cartItemRepository from "../repositories/cart_item.repository";
import * as productRepository from "../repositories/product.repository.js";
import * as cartService from "../services/cart.service";

// =======================================
// HELPER
// =======================================

const checkQuantity = (stockQuantity: number, requestedQuantity: number) => {
  if (requestedQuantity > stockQuantity) {
    throw new AppError(
      409,
      `Only ${stockQuantity} units are currently available`,
    );
  }
};

// =======================================
// SERVICES
// =======================================

export const getCartItems = async (
  params: GetCartItemsParams,
): Promise<GetCartItemsResult> => {
  const { userId, filters } = params;

  const { cart_items, total } = await cartItemRepository.find(userId, filters);

  const { page, limit } = filters;

  return {
    cart_items,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const addToCart = async (
  params: AddToCartParams,
): Promise<CartItemWithRelations> => {
  const { userId, payload } = params;
  const { productId, quantity } = payload;

  const product = await productRepository.findWithRelationsById(productId);

  if (!product) {
    throw new AppError(400, "Product not found");
  }

  const { stock_quantity } = product;

  if (product.stock_quantity === 0) {
    throw new AppError(400, "Product has insufficient stock");
  }

  const cart = await cartService.getOrCreateCart(userId);

  const existing = await cartItemRepository.findById(userId, productId);

  if (existing) {
    const newQuantity = existing.quantity + quantity;

    checkQuantity(stock_quantity, newQuantity);

    return await cartItemRepository.update(userId, productId, {
      quantity: newQuantity,
    });
  }

  checkQuantity(product.stock_quantity, quantity);

  const data = {
    ...payload,
    product_id: productId,
    cart_id: cart.id,
  };

  return await cartItemRepository.add(userId, data);
};

export const getCartItemById = async (params: GetCartItemParams) => {
  const { userId, productId } = params;

  const cartItem = await cartItemRepository.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  return cartItem;
};

export const updateItemQuantity = async (
  params: UpdateItemQuantityParams,
): Promise<CartItemWithRelations | void> => {
  const { userId, productId, payload } = params;

  const product = await productRepository.findWithRelationsById(productId);

  if (!product) {
    throw new AppError(400, "Product not found");
  }

  const cartItem = await cartItemRepository.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  const { quantity } = payload;

  if (cartItem.quantity === quantity) {
    throw new AppError(400, "No changes has been made");
  }

  if (quantity === 0) {
    return await cartItemRepository.remove(userId, productId);
  }

  checkQuantity(product.stock_quantity, quantity);

  return await cartItemRepository.update(userId, productId, { quantity });
};

export const removeFromCart = async (
  params: RemoveFromCartParams,
): Promise<void> => {
  const { userId, productId } = params;

  const cartItem = await cartItemRepository.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  await cartItemRepository.remove(userId, productId);
};
