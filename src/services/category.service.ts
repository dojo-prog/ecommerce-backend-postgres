import {
  Category,
  CategoryQuery,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "../schemas/categories";
import generateSlug from "../utils/generateSlug";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";

import * as categoryRepository from "../repositories/category.repository";
import { GetCategoriesResult } from "../types/entities/category.types";

export const getCategories = async (
  filters: CategoryQuery,
): Promise<GetCategoriesResult> => {
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
  payload: CreateCategoryBody,
): Promise<Category> => {
  const slug = generateSlug(payload.name);

  return await categoryRepository.add({ ...payload, slug });
};

export const getCategoryBySlug = async (
  categorySlug: string,
): Promise<Category> => {
  const category = await categoryRepository.findBySlug(categorySlug);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryBody,
): Promise<Category> => {
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

export const deleteCategory = async (categoryId: string) => {
  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  await categoryRepository.remove(categoryId);

  return category;
};
