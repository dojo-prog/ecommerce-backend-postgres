import { Controller } from "../types/handlers";
import * as categoryService from "../services/category.service";
import {
  CategoryQuerySchema,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "../schemas/categories";

export const getCategories: Controller = async (req, res, next) => {
  try {
    const data = await categoryService.getCategories({
      filters: CategoryQuerySchema.parse(req.query),
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCategory: Controller = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory({
      payload: req.body as CreateCategoryBody,
    });

    res
      .status(201)
      .json({ success: true, message: "Category created", data: { category } });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug: Controller = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug({
      categorySlug: req.params.categorySlug as string,
    });

    res.status(200).json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

export const updateCategory: Controller = async (req, res, next) => {
  try {
    const data = await categoryService.updateCategory({
      categoryId: req.params.categoryId as string,
      payload: req.body as UpdateCategoryBody,
    });

    res.status(200).json({ success: true, message: "Category updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory: Controller = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory({
      categoryId: req.params.categoryId as string,
    });

    res
      .status(200)
      .json({ success: true, message: "Category deleted", data: { category } });
  } catch (error) {
    next(error);
  }
};
