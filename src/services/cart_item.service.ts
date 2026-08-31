import {
  AddToCartPayload,
  CartItemQueryPayload,
  CartItemQueryResult,
  CartItemRelations,
  UpdateCartItemPayload,
} from "../schemas/cart_items";
import AppError from "../utils/AppError";

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
  userId: string,
  filters: CartItemQueryPayload,
): Promise<CartItemQueryResult> => {
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
  userId: string,
  payload: AddToCartPayload,
): Promise<CartItemRelations> => {
  const { product_id } = payload;

  const product = await productRepository.findById(product_id);

  if (!product) {
    throw new AppError(400, "Product not found");
  }

  const { stock_quantity } = product;

  if (product.stock_quantity === 0) {
    throw new AppError(400, "Product has insufficient stock");
  }

  const cart = await cartService.getOrCreateCart(userId);

  const existing = await cartItemRepository.findById(userId, product_id);

  if (existing) {
    const newQuantity = existing.quantity + payload.quantity;

    checkQuantity(stock_quantity, newQuantity);

    return await cartItemRepository.update(userId, product_id, {
      quantity: newQuantity,
    });
  }

  checkQuantity(product.stock_quantity, payload.quantity);

  return await cartItemRepository.add(userId, { ...payload, cart_id: cart.id });
};

export const getCartItemById = async (userId: string, productId: string) => {
  const cartItem = await cartItemRepository.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  return cartItem;
};

export const updateItemQuantity = async (
  userId: string,
  productId: string,
  payload: UpdateCartItemPayload,
): Promise<CartItemRelations | void> => {
  const product = await productRepository.findById(productId);

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
  userId: string,
  productId: string,
): Promise<void> => {
  const cartItem = await cartItemRepository.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  await cartItemRepository.remove(userId, productId);
};
