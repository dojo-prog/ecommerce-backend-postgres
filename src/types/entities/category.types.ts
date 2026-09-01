import { GetResult } from "./common";
import { Category } from "../../schemas/categories/category.schema";
import { CategoryQuery } from "../../schemas/categories";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetCategoriesParams {
  filters: CategoryQuery;
}

export interface GetCategoryBySlugParams {
  categorySlug: string;
}

export interface BaseCategoryPayload {
  name: string;
}

export interface CreateCategoryParams {
  payload: BaseCategoryPayload;
}

export interface UpdateCategoryParams {
  categoryId: string;
  payload: BaseCategoryPayload;
}

export interface DeleteCategoryParams {
  categoryId: string;
}

// =======================================
// RESULT
// =======================================

export type GetCategoriesResult = GetResult<"categories", Category>;
