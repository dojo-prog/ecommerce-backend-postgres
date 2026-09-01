import { Inventory } from "../../schemas/inventories";
import { UpdateResult } from "./common";

// =======================================
// SERIVICE PARAMS
// =======================================

export interface GetProductInventoryParams {
  productId: string;
}

export interface AddInventoryStockParams {
  productId: string;
  quantity: number;
}

export interface UpdateProductInventoryParams {
  productId: string;
  newQuantity: number;
}

// =======================================
// RESULT
// =======================================

export type UpdateInvetoryResult = UpdateResult<"inventory", Inventory>;
