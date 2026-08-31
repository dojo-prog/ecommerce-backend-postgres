import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CreateSubcategoryBodySchema,
  SubcategoryIdParamsSchema,
  SubcategoryQuerySchema,
  SubcategorySlugParamsSchema,
  UpdateSubcategoryBodySchema,
} from "../schemas/subcategories";
import {
  CategoryIdParamsSchema,
  CategorySlugParamsSchema,
} from "../schemas/categories";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategoryBySlug,
  updateSubcategory,
} from "../controllers/subcategory.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router.route("/:categorySlug/subcategory").get(
  readLimiter,
  validate({
    params: CategorySlugParamsSchema,
    query: SubcategoryQuerySchema,
  }),
  getSubcategories,
);

router.post(
  "/:categoryId/subcategory",
  writeLimiter,
  protectRoute,
  authorizeRoles(["admin"]),
  validate({
    params: CategoryIdParamsSchema,
    body: CreateSubcategoryBodySchema,
  }),
  createSubcategory,
);

router.get(
  "/:categorySlug/subcategory/:subcategorySlug",
  readLimiter,
  validate({
    params: CategorySlugParamsSchema.merge(SubcategorySlugParamsSchema),
  }),
  getSubcategoryBySlug,
);

router
  .route("/:categoryId/subcategory/:subcategoryId")
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: CategoryIdParamsSchema.merge(SubcategoryIdParamsSchema),
      body: UpdateSubcategoryBodySchema,
    }),
    updateSubcategory,
  )
  .delete(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: CategoryIdParamsSchema.merge(SubcategoryIdParamsSchema),
    }),
    deleteSubcategory,
  );

export default router;
