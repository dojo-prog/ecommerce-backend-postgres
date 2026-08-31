import { Controller } from "../types/handlers";
import * as cartItemService from "../services/cart_item.service";
import {
  AddToCartBody,
  CartItemQuerySchema,
  UpdateCartItemBody,
} from "../schemas/cart_items";

export const getCartItems: Controller = async (req, res, next) => {
  try {
    const data = await cartItemService.getCartItems(
      req.user!.id,
      CartItemQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addToCart: Controller = async (req, res, next) => {
  try {
    const cart_item = await cartItemService.addToCart(
      req.user!.id,
      req.body as AddToCartBody,
    );

    res
      .status(201)
      .json({ success: true, message: "Added to cart", data: { cart_item } });
  } catch (error) {
    next(error);
  }
};

export const getCartItemById: Controller = async (req, res, next) => {
  try {
    const cart_item = await cartItemService.getCartItemById(
      req.user!.id,
      req.params.productId as string,
    );

    res.status(200).json({ success: true, data: { cart_item } });
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity: Controller = async (req, res, next) => {
  try {
    const cart_item = await cartItemService.updateItemQuantity(
      req.user!.id,
      req.params.productId as string,
      req.body as UpdateCartItemBody,
    );

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      data: { cart_item },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart: Controller = async (req, res, next) => {
  try {
    await cartItemService.removeFromCart(
      req.user!.id,
      req.params.productId as string,
    );

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};
