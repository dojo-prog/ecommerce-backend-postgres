import { Category } from "../schemas/categories";
import generateSlug from "../utils/generateSlug";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import {
  CreateCategoryParams,
  DeleteCategoryParams,
  GetCategoriesParams,
  GetCategoriesResult,
  GetCategoryBySlugParams,
  UpdateCategoryParams,
} from "../types/entities/category.types";

import * as categoryRepository from "../repositories/category.repository";

export const getCategories = async (
  params: GetCategoriesParams,
): Promise<GetCategoriesResult> => {
  const { filters } = params;

  const { categories, total } = await categoryRepository.find(filters);

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
  params: CreateCategoryParams,
): Promise<Category> => {
  const { payload } = params;

  const slug = generateSlug(payload.name);

  return await categoryRepository.add({ ...payload, slug });
};

export const getCategoryBySlug = async (
  params: GetCategoryBySlugParams,
): Promise<Category> => {
  const { categorySlug } = params;

  const category = await categoryRepository.findBySlug(categorySlug);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

export const updateCategory = async (
  params: UpdateCategoryParams,
): Promise<Category> => {
  const { categoryId, payload } = params;

  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const { old_values, new_values } = generateChanges(category, payload);

  if (new_values.name) {
    new_values.slug = generateSlug(new_values.name as string);
    old_values.slug = category.slug;
  }

  return await categoryRepository.update(categoryId, new_values);
};

export const deleteCategory = async (params: DeleteCategoryParams) => {
  const { categoryId } = params;

  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  await categoryRepository.remove(categoryId);

  return category;
};
