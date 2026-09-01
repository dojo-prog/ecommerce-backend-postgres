import {
  CreateProductBody,
  ProductQuery,
  ProductWithRelations,
} from "../../schemas/products";
import { GetResult, UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetProductsParams {
  filters: ProductQuery;
}

export interface GetProductParams {
  productId: string;
}

export interface BaseProductPayload {
  subcategoryId: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  weightGrams: number;
  isActive?: boolean | undefined;
  initialQuantity?: number | undefined;
}

export interface CreateProductParams {
  payload: BaseProductPayload;
  thumbnail?: Express.Multer.File;
}

export interface UpdateProductParams {
  productId: string;
  payload: BaseProductPayload;
  thumbnail?: Express.Multer.File;
}

export interface DeleteProductParams {
  productId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateProductData {
  subcategory_id: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  weight_grams: number;
  is_active?: boolean | undefined;
  initial_quantity?: number | undefined;
  thumbnail_url?: string;
  thumbnail_public_id?: string;
}

// =======================================
// RESULT
// =======================================

export type GetProductsResult = GetResult<"products", ProductWithRelations>;

export type UpdateProductResult = UpdateResult<"product", ProductWithRelations>;
