import { CartItemWithRelations } from "../../schemas/cart_items";
import { GetResult } from "./common";

// =======================================
// RESULT
// =======================================

export type GetCartItemsResult = GetResult<"cart_items", CartItemWithRelations>;
