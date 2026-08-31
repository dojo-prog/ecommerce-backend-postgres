import { UpdateCategoryBody } from "../schemas/categories";
import {
  CreateSubcategoryBody,
  Subcategory,
  SubcategoryQuery,
} from "../schemas/subcategories";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import generateSlug from "../utils/generateSlug";

import * as subcategoryRepository from "../repositories/subcategory.repository";
import * as categoryRepository from "../repositories/category.repository";
import {
  GetSubcategoriesResult,
  UpdateSubcategoryResult,
} from "../types/entities/subcategory.types";

export const getSubcategories = async (
  categorySlug: string,
  filters: SubcategoryQuery,
): Promise<GetSubcategoriesResult> => {
  const category = await categoryRepository.findBySlug(categorySlug);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const { subcategories, total } = await subcategoryRepository.find(
    category.id,
    filters,
  );

  const { page, limit } = filters;

  return {
    subcategories,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const createSubcategory = async (
  categoryId: string,
  payload: CreateSubcategoryBody,
): Promise<Subcategory> => {
  const { name } = payload;

  const existing = await subcategoryRepository.findByName(categoryId, name);

  if (existing) {
    throw new AppError(
      400,
      `A subcategory named (${name}) is already registered in this category`,
    );
  }

  const slug = generateSlug(name);

  return await subcategoryRepository.add({
    category_id: categoryId,
    ...payload,
    slug,
  });
};

export const getSubcategoryBySlug = async (
  categorySlug: string,
  subcategorySlug: string,
): Promise<Subcategory> => {
  const subcategory = await subcategoryRepository.findBySlug(
    categorySlug,
    subcategorySlug,
  );

  if (!subcategory) {
    throw new AppError(404, "Subcategory not found");
  }

  return subcategory;
};

export const updateSubcategory = async (
  categoryId: string,
  subcategoryId: string,
  payload: UpdateCategoryBody,
): Promise<UpdateSubcategoryResult> => {
  const subcategory = await subcategoryRepository.findById(
    categoryId,
    subcategoryId,
  );

  if (!subcategory) {
    throw new AppError(404, "Subcategory not found");
  }

  const { old_values, new_values } = generateChanges(subcategory, payload);

  if (new_values.name) {
    new_values.slug = generateSlug(new_values.name as string);
    old_values.slug = subcategory.slug;
  }

  const updated = await subcategoryRepository.update(
    categoryId,
    subcategoryId,
    new_values,
  );

  return {
    subcategory: updated,
    old_values,
    new_values,
  };
};

export const deleteSubcategory = async (
  categoryId: string,
  subcategoryId: string,
): Promise<Subcategory> => {
  const subcategory = await subcategoryRepository.findById(
    categoryId,
    subcategoryId,
  );

  if (!subcategory) {
    throw new AppError(404, "Subcategory not found");
  }

  await subcategoryRepository.remove(categoryId, subcategoryId);

  return subcategory;
};
