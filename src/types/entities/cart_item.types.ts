import { CartItemQuery, CartItemWithRelations } from "../../schemas/cart_items";
import { GetResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetCartItemsParams {
  userId: string;
  filters: CartItemQuery;
}

export interface GetCartItemParams {
  userId: string;
  productId: string;
}

export interface AddToCartParams {
  userId: string;
  payload: {
    productId: string;
    quantity: number;
  };
}

export interface UpdateItemQuantityParams {
  userId: string;
  productId: string;
  payload: {
    quantity: number;
  };
}

export interface RemoveFromCartParams {
  userId: string;
  productId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface AddToCartData {
  product_id: string;
  cart_id: string;
  quantity: number;
}

// =======================================
// RESULT
// =======================================

export type GetCartItemsResult = GetResult<"cart_items", CartItemWithRelations>;
