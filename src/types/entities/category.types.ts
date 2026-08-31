import { GetResult } from "./common";
import { Category } from "../../schemas/categories/category.schema";

// =======================================
// RESULT
// =======================================

export type GetCategoriesResult = GetResult<"categories", Category>;
