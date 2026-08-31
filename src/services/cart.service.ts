import { Cart } from "../schemas/carts";

import * as cartRepository from "../repositories/cart.repository";

export const getOrCreateCart = async (userId: string): Promise<Cart> => {
  const exisiting = await cartRepository.findByUserId(userId);

  if (exisiting) {
    return exisiting;
  }

  return await cartRepository.add(userId);
};
