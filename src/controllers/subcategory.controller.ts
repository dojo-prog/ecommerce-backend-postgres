import { Controller } from "../types/handlers";
import * as subcategoryService from "../services/subcategory.service";
import {
  CreateSubcategoryBody,
  SubcategoryQuerySchema,
  UpdateSubcategoryBody,
} from "../schemas/subcategories";

export const getSubcategories: Controller = async (req, res, next) => {
  try {
    const data = await subcategoryService.getSubcategories({
      categorySlug: req.params.categorySlug as string,
      filters: SubcategoryQuerySchema.parse(req.query),
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSubcategory: Controller = async (req, res, next) => {
  try {
    const subcategory = await subcategoryService.createSubcategory({
      payload: {
        categoryId: req.params.categoryId as string,
        name: req.body.name,
      },
    });

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
    const subcategory = await subcategoryService.getSubcategoryBySlug({
      categorySlug: req.params.categorySlug as string,
      subcategorySlug: req.params.subcategorySlug as string,
    });

    res.status(200).json({ success: true, data: { subcategory } });
  } catch (error) {
    next(error);
  }
};

export const updateSubcategory: Controller = async (req, res, next) => {
  try {
    const data = await subcategoryService.updateSubcategory({
      categoryId: req.params.categoryId as string,
      subcategoryId: req.params.subcategoryId as string,
      payload: req.body as UpdateSubcategoryBody,
    });

    res.status(200).json({ success: true, message: "Category updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteSubcategory: Controller = async (req, res, next) => {
  try {
    const subcategory = await subcategoryService.deleteSubcategory({
      categoryId: req.params.categoryId as string,
      subcategoryId: req.params.subcategoryId as string,
    });

    res.status(200).json({
      success: true,
      message: "Subcategory deleted",
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};
