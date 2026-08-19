import * as cartItemModel from "../models/cart_item.model";
import * as productModel from "../models/product.model";
import * as cartService from "../services/cart.service";
import {
  AddToCartPayload,
  CartItemQueryPayload,
  CartItemQueryResult,
  CartItemRelations,
  UpdateCartItemPayload,
} from "../schemas/cart_items";
import AppError from "../utils/AppError";

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
  const { cart_items, total } = await cartItemModel.find(userId, filters);

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

  const product = await productModel.findById(product_id);

  if (!product) {
    throw new AppError(400, "Product not found");
  }

  const { stock_quantity } = product;

  if (product.stock_quantity === 0) {
    throw new AppError(400, "Product has insufficient stock");
  }

  const cart = await cartService.getOrCreateCart(userId);

  const existing = await cartItemModel.findById(userId, product_id);

  if (existing) {
    const newQuantity = existing.quantity + payload.quantity;

    checkQuantity(stock_quantity, newQuantity);

    return await cartItemModel.update(userId, product_id, {
      quantity: newQuantity,
    });
  }

  checkQuantity(product.stock_quantity, payload.quantity);

  return await cartItemModel.add(userId, { ...payload, cart_id: cart.id });
};

export const getCartItemById = async (userId: string, productId: string) => {
  const cartItem = await cartItemModel.findById(userId, productId);

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
  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError(400, "Product not found");
  }

  const cartItem = await cartItemModel.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  const { quantity } = payload;

  if (cartItem.quantity === quantity) {
    throw new AppError(400, "No changes has been made");
  }

  if (quantity === 0) {
    return await cartItemModel.remove(userId, productId);
  }

  checkQuantity(product.stock_quantity, quantity);

  return await cartItemModel.update(userId, productId, { quantity });
};

export const removeFromCart = async (
  userId: string,
  productId: string,
): Promise<void> => {
  const cartItem = await cartItemModel.findById(userId, productId);

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  await cartItemModel.remove(userId, productId);
};
