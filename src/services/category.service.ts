import {
  Category,
  CategoryQueryPayload,
  CategoryQueryResult,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../schemas/categories";
import * as categoryModel from "../models/category.model";
import generateSlug from "../utils/generateSlug";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";

export const getCategories = async (
  filters: CategoryQueryPayload,
): Promise<CategoryQueryResult> => {
  const { categories, total } = await categoryModel.find(filters);

  const { page, limit } = filters;

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const slug = generateSlug(payload.name);

  return await categoryModel.add({ ...payload, slug });
};

export const getCategoryBySlug = async (
  categorySlug: string,
): Promise<Category> => {
  const category = await categoryModel.findBySlug(categorySlug);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryPayload,
): Promise<Category> => {
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const { old_values, new_values } = generateChanges(category, payload);

  if (new_values.name) {
    new_values.slug = generateSlug(new_values.name as string);
    old_values.slug = category.slug;
  }

  return await categoryModel.update(categoryId, new_values);
};

export const deleteCategory = async (categoryId: string) => {
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  await categoryModel.remove(categoryId);

  return category;
};
