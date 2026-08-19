import * as cartModel from "../models/cart.model";
import { Cart } from "../schemas/cart";

export const getOrCreateCart = async (userId: string): Promise<Cart> => {
  const exisiting = await cartModel.findByUserId(userId);

  if (exisiting) {
    return exisiting;
  }

  return await cartModel.add(userId);
};
