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
  CreateSubcategoryData,
  CreateSubcategoryParams,
  DeleteSubcategoryParams,
  GetSubcategoriesParams,
  GetSubcategoriesResult,
  GetSubcategoryBySlugParams,
  UpdateSubcategoryParams,
  UpdateSubcategoryResult,
} from "../types/entities/subcategory.types";

export const getSubcategories = async (
  params: GetSubcategoriesParams,
): Promise<GetSubcategoriesResult> => {
  const { categorySlug, filters } = params;

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
  params: CreateSubcategoryParams,
): Promise<Subcategory> => {
  const { payload } = params;

  const { categoryId, name } = payload;

  const existing = await subcategoryRepository.findByName(categoryId, name);

  if (existing) {
    throw new AppError(
      400,
      `A subcategory named (${name}) is already registered in this category`,
    );
  }

  const slug = generateSlug(name);

  const data: CreateSubcategoryData = {
    ...payload,
    category_id: categoryId,
    slug,
  };

  return await subcategoryRepository.add(data);
};

export const getSubcategoryBySlug = async (
  params: GetSubcategoryBySlugParams,
): Promise<Subcategory> => {
  const { categorySlug, subcategorySlug } = params;

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
  params: UpdateSubcategoryParams,
): Promise<UpdateSubcategoryResult> => {
  const { categoryId, subcategoryId, payload } = params;

  const subcategory = await subcategoryRepository.findById(
    categoryId,
    subcategoryId,
  );

  if (!subcategory) {
    throw new AppError(404, "Subcategory not found");
  }

  const mod: Partial<Subcategory> = {
    ...payload,
    category_id: categoryId,
  };

  const { old_values, new_values } = generateChanges(subcategory, mod);

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
  params: DeleteSubcategoryParams,
): Promise<Subcategory> => {
  const { categoryId, subcategoryId } = params;

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
