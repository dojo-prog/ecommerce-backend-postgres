import { Subcategory, SubcategoryQuery } from "../../schemas/subcategories";
import { GetResult, UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetSubcategoriesParams {
  categorySlug: string;
  filters: SubcategoryQuery;
}

export interface GetSubcategoryBySlugParams {
  categorySlug: string;
  subcategorySlug: string;
}

export interface BaseSubcategoryPayload {
  categoryId: string;
  name: string;
}

export interface CreateSubcategoryParams {
  payload: BaseSubcategoryPayload;
}

export interface UpdateSubcategoryParams {
  categoryId: string;
  subcategoryId: string;
  payload: BaseSubcategoryPayload;
}

export interface DeleteSubcategoryParams {
  categoryId: string;
  subcategoryId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateSubcategoryData {
  category_id: string;
  name: string;
  slug: string;
}

// =======================================
// RESULT
// =======================================

export type GetSubcategoriesResult = GetResult<"subcategories", Subcategory>;

export type UpdateSubcategoryResult = UpdateResult<"subcategory", Subcategory>;
