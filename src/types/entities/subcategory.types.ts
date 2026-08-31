import { Subcategory } from "../../schemas/subcategories";
import { GetResult, UpdateResult } from "./common";

// =======================================
// RESULT
// =======================================

export type GetSubcategoriesResult = GetResult<"subcategories", Subcategory>;

export type UpdateSubcategoryResult = UpdateResult<"subcategory", Subcategory>;
