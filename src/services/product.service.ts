import {
  CreateProductFinalPayload,
  CreateProductPayload,
  ProductQueryPayload,
  ProductQueryResult,
  ProductRelations,
  UpdateProductPayload,
  UpdateProductResult,
} from "../schemas/products";
import { createInventory } from "../services/inventory.service";
import AppError from "../utils/AppError";
import { uploadMulterImage } from "../integrations/cloudinary/upload";
import generateChanges from "../utils/generateChanges";
import { deleteImage } from "../integrations/cloudinary/delete";

import * as productRepository from "../repositories/product.repository";

export const getProducts = async (
  filters: ProductQueryPayload,
): Promise<ProductQueryResult> => {
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
  payload: CreateProductPayload,
  thumbnail?: Express.Multer.File,
): Promise<ProductRelations> => {
  const existing = await productRepository.findByName(payload.name);

  if (existing) {
    throw new AppError(400, `A product named ${payload.name} already exists`);
  }

  const { initial_quantity, ...rest } = payload;

  const finalPayload: CreateProductFinalPayload = {
    ...rest,
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

  return await productRepository.findById(product.id);
};

export const getProductById = async (productId: string) => {
  const product = await productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  return product;
};

export const updateProduct = async (
  productId: string,
  payload: UpdateProductPayload,
  thumbnail?: Express.Multer.File,
): Promise<UpdateProductResult> => {
  const product = await productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  const { old_values, new_values } = generateChanges(product, payload);

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

  const updated = await productRepository.findById(productId);

  return {
    product: updated,
    old_values,
    new_values,
  };
};

export const deleteProduct = async (
  productId: string,
): Promise<ProductRelations> => {
  const product = await productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.thumbnail_public_id) {
    deleteImage(product.thumbnail_public_id);
  }

  await productRepository.remove(productId);

  return product;
};
