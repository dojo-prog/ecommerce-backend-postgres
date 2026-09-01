import { Product, ProductWithRelations } from "../schemas/products";
import { createInventory } from "../services/inventory.service";
import AppError from "../utils/AppError";
import { uploadMulterImage } from "../integrations/cloudinary/upload";
import generateChanges from "../utils/generateChanges";
import { deleteImage } from "../integrations/cloudinary/delete";
import {
  CreateProductData,
  CreateProductParams,
  DeleteProductParams,
  GetProductParams,
  GetProductsParams,
  GetProductsResult,
  UpdateProductParams,
  UpdateProductResult,
} from "../types/entities/product.types";

import * as productRepository from "../repositories/product.repository";

export const getProducts = async (
  params: GetProductsParams,
): Promise<GetProductsResult> => {
  const { filters } = params;

  const { products, total } = await productRepository.find(filters);

  const { page, limit } = filters;

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export const createProduct = async (
  params: CreateProductParams,
): Promise<ProductWithRelations> => {
  const { payload, thumbnail } = params;

  const existing = await productRepository.findByName(payload.name);

  if (existing) {
    throw new AppError(400, `A product named ${payload.name} already exists`);
  }

  const { initialQuantity: initial_quantity, ...rest } = payload;
  const { subcategoryId, priceCents, weightGrams, isActive } = rest;

  const finalPayload: CreateProductData = {
    ...rest,
    subcategory_id: subcategoryId,
    price_cents: priceCents,
    weight_grams: weightGrams,
    is_active: isActive,
  };

  if (thumbnail) {
    const { url, public_id } = await uploadMulterImage(
      thumbnail,
      "products/thumbnails",
    );

    finalPayload.thumbnail_url = url;
    finalPayload.thumbnail_public_id = public_id;
  }

  const product = await productRepository.add(finalPayload);

  await createInventory(
    product.id,
    initial_quantity !== undefined ? initial_quantity : 0,
  );

  return await productRepository.findWithRelationsById(product.id);
};

export const getProductById = async (params: GetProductParams) => {
  const { productId } = params;

  const product = await productRepository.findWithRelationsById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  return product;
};

export const updateProduct = async (
  params: UpdateProductParams,
): Promise<UpdateProductResult> => {
  const { productId, payload, thumbnail } = params;

  const product = await productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  const { subcategoryId, priceCents, weightGrams, isActive } = payload;

  const mod: Partial<Product> = {
    ...payload,
    subcategory_id: subcategoryId,
    price_cents: priceCents,
    weight_grams: weightGrams,
    is_active: isActive,
  };

  const { old_values, new_values } = generateChanges(product, mod, false);

  // Existing name check
  if (new_values.name) {
    const existing = await productRepository.findByName(
      new_values.name as string,
    );

    if (existing) {
      throw new AppError(400, `A product named ${payload.name} already exists`);
    }
  }

  // New thumbnail handling
  if (thumbnail) {
    const { url, public_id } = await uploadMulterImage(
      thumbnail,
      "products/thumbnails",
    );

    new_values.thumbnail_url = url;
    new_values.thumbnail_public_id = public_id;

    const { thumbnail_url, thumbnail_public_id } = product;

    old_values.thumbnail_url = thumbnail_url;
    old_values.thumbnail_public_id = thumbnail_public_id;

    if (thumbnail_public_id) {
      deleteImage(thumbnail_public_id);
    }
  }

  if (Object.keys(new_values).length === 0) {
    throw new AppError(400, "No changes have been made");
  }

  const updated = await productRepository.findWithRelationsById(productId);

  return {
    product: updated,
    old_values,
    new_values,
  };
};

export const deleteProduct = async (
  params: DeleteProductParams,
): Promise<ProductWithRelations> => {
  const { productId } = params;

  const product = await productRepository.findWithRelationsById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.thumbnail_public_id) {
    deleteImage(product.thumbnail_public_id);
  }

  await productRepository.remove(productId);

  return product;
};
