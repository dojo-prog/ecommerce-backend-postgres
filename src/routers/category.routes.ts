import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CategoryIdParamsSchema,
  CategoryQuerySchema,
  CategorySlugParamsSchema,
  CreateCategoryBodySchema,
  UpdateCategoryBodySchema,
} from "../schemas/categories";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/category.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router
  .route("/")
  .get(readLimiter, validate({ query: CategoryQuerySchema }), getCategories)
  .post(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: CreateCategoryBodySchema }),
    createCategory,
  );

router.get(
  "/:categorySlug",
  readLimiter,
  validate({ params: CategorySlugParamsSchema }),
  getCategoryBySlug,
);

router
  .route("/:categoryId")
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: CategoryIdParamsSchema,
      body: UpdateCategoryBodySchema,
    }),
    updateCategory,
  )
  .delete(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: CategoryIdParamsSchema }),
    deleteCategory,
  );

export default router;
