import { Controller } from "../types/handlers";
import * as subcategoryService from "../services/subcategory.service";
import {
  CreateSubcategoryPayload,
  SubcategoryQuerySchema,
  UpdateSubcategoryPayload,
} from "../schemas/subcategories";

export const getSubcategories: Controller = async (req, res, next) => {
  try {
    const data = await subcategoryService.getSubcategories(
      req.params.categorySlug as string,
      SubcategoryQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSubcategory: Controller = async (req, res, next) => {
  try {
    const subcategory = await subcategoryService.createSubcategory(
      req.params.categoryId as string,
      req.body as CreateSubcategoryPayload,
    );

    res.status(201).json({
      success: true,
      message: "Subcategory created",
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubcategoryBySlug: Controller = async (req, res, next) => {
  try {
    const subcategory = await subcategoryService.getSubcategoryBySlug(
      req.params.categorySlug as string,
      req.params.subcategorySlug as string,
    );

    res.status(200).json({ success: true, data: { subcategory } });
  } catch (error) {
    next(error);
  }
};

export const updateSubcategory: Controller = async (req, res, next) => {
  try {
    const data = await subcategoryService.updateSubcategory(
      req.params.categoryId as string,
      req.params.subcategoryId as string,
      req.body as UpdateSubcategoryPayload,
    );

    res.status(200).json({ success: true, message: "Category updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteSubcategory: Controller = async (req, res, next) => {
  try {
    const subcategory = await subcategoryService.deleteSubcategory(
      req.params.categoryId as string,
      req.params.subcategoryId as string,
    );

    res.status(200).json({
      success: true,
      message: "Subcategory deleted",
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};
