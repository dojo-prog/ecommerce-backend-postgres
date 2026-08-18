import * as subcategoryModel from "../models/subcategory.model";
import * as categoryModel from "../models/category.model";
import { UpdateCategoryPayload } from "../schemas/categories";
import {
  CreateSubcategoryPayload,
  Subcategory,
  SubcategoryQueryPayload,
  SubcategoryQueryResult,
  UpdateSubcategoryResult,
} from "../schemas/subcategories";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import generateSlug from "../utils/generateSlug";

export const getSubcategories = async (
  categorySlug: string,
  filters: SubcategoryQueryPayload,
): Promise<SubcategoryQueryResult> => {
  const category = await categoryModel.findBySlug(categorySlug);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const { subcategories, total } = await subcategoryModel.find(
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
  payload: CreateSubcategoryPayload,
): Promise<Subcategory> => {
  const { name } = payload;

  const existing = await subcategoryModel.findByName(categoryId, name);

  if (existing) {
    throw new AppError(
      400,
      `A subcategory named (${name}) is already registered in this category`,
    );
  }

  const slug = generateSlug(name);

  return await subcategoryModel.add({
    category_id: categoryId,
    ...payload,
    slug,
  });
};

export const getSubcategoryBySlug = async (
  categorySlug: string,
  subcategorySlug: string,
): Promise<Subcategory> => {
  const subcategory = await subcategoryModel.findBySlug(
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
  payload: UpdateCategoryPayload,
): Promise<UpdateSubcategoryResult> => {
  const subcategory = await subcategoryModel.findById(
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

  const updated = await subcategoryModel.update(
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
  const subcategory = await subcategoryModel.findById(
    categoryId,
    subcategoryId,
  );

  if (!subcategory) {
    throw new AppError(404, "Subcategory not found");
  }

  await subcategoryModel.remove(categoryId, subcategoryId);

  return subcategory;
};
