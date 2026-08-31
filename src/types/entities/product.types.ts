import { ProductWithRelations } from "../../schemas/products";
import { GetResult, UpdateResult } from "./common";

// =======================================
// RESULT
// =======================================

export type GetProductsResult = GetResult<"products", ProductWithRelations>;

export type UpdateProductResult = UpdateResult<"product", ProductWithRelations>;
