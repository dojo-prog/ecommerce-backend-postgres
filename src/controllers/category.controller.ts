import { Controller } from "../types/handlers";
import * as categoryService from "../services/category.service";
import {
  CategoryQuerySchema,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../schemas/categories";

export const getCategories: Controller = async (req, res, next) => {
  try {
    const data = await categoryService.getCategories(
      CategoryQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCategory: Controller = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(
      req.body as CreateCategoryPayload,
    );

    res
      .status(201)
      .json({ success: true, message: "Category created", data: { category } });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug: Controller = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug(
      req.params.categorySlug as string,
    );

    res.status(200).json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

export const updateCategory: Controller = async (req, res, next) => {
  try {
    const data = await categoryService.updateCategory(
      req.params.categoryId as string,
      req.body as UpdateCategoryPayload,
    );

    res.status(200).json({ success: true, message: "Category updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory: Controller = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(
      req.params.categoryId as string,
    );

    res
      .status(200)
      .json({ success: true, message: "Category deleted", data: { category } });
  } catch (error) {
    next(error);
  }
};
