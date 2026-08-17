import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CategoryIdParamsSchema,
  CategoryQuerySchema,
  CategorySlugParamsSchema,
  CreateCategoryInputSchema,
  UpdateCategoryInputSchema,
} from "../schemas/categories";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/category.controller";

const router = express.Router();

router
  .route("/")
  .get(validate({ query: CategoryQuerySchema }), getCategories)
  .post(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: CreateCategoryInputSchema }),
    createCategory,
  );

router.get(
  "/:categorySlug",
  validate({ params: CategorySlugParamsSchema }),
  getCategoryBySlug,
);

router
  .route("/:categoryId")
  .patch(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: CategoryIdParamsSchema,
      body: UpdateCategoryInputSchema,
    }),
    updateCategory,
  )
  .delete(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: CategoryIdParamsSchema }),
    deleteCategory,
  );

export default router;
