import {
  CreateProductBody,
  ProductWithRelations,
} from "../../schemas/products";
import { GetResult, UpdateResult } from "./common";

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateProductData extends CreateProductBody {
  thumbnail_url?: string;
  thumbnail_public_id?: string;
}

// =======================================
// RESULT
// =======================================

export type GetProductsResult = GetResult<"products", ProductWithRelations>;

export type UpdateProductResult = UpdateResult<"product", ProductWithRelations>;
