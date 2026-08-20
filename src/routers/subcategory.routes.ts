import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CreateSubcategoryInputSchema,
  SubcategoryIdParamsSchema,
  SubcategoryQuerySchema,
  SubcategorySlugParamsSchema,
  UpdateSubcategoryInputSchema,
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

const router = express.Router();

router.route("/:categorySlug/subcategory").get(
  validate({
    params: CategorySlugParamsSchema,
    query: SubcategoryQuerySchema,
  }),
  getSubcategories,
);

router.post(
  "/:categoryId/subcategory",
  protectRoute,
  authorizeRoles(["admin"]),
  validate({
    params: CategoryIdParamsSchema,
    body: CreateSubcategoryInputSchema,
  }),
  createSubcategory,
);

router.get(
  "/:categorySlug/subcategory/:subcategorySlug",
  validate({
    params: CategorySlugParamsSchema.merge(SubcategorySlugParamsSchema),
  }),
  getSubcategoryBySlug,
);

router
  .route("/:categoryId/subcategory/:subcategoryId")
  .patch(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: CategoryIdParamsSchema.merge(SubcategoryIdParamsSchema),
      body: UpdateSubcategoryInputSchema,
    }),
    updateSubcategory,
  )
  .delete(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: CategoryIdParamsSchema.merge(SubcategoryIdParamsSchema),
    }),
    deleteSubcategory,
  );

export default router;
