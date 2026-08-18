import { Controller } from "../types/handlers";
import * as productService from "../services/product.service";
import {
  CreateProductPayload,
  ProductQuerySchema,
  UpdateProductPayload,
} from "../schemas/products";

export const getProducts: Controller = async (req, res, next) => {
  try {
    const data = await productService.getProducts(
      ProductQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createProduct: Controller = async (req, res, next) => {
  try {
    const product = await productService.createProduct(
      req.body as CreateProductPayload,
      req.file,
    );

    res
      .status(201)
      .json({ success: true, message: "Product created", data: { product } });
  } catch (error) {
    next(error);
  }
};

export const getProductById: Controller = async (req, res, next) => {
  try {
    const product = await productService.getProductById(
      req.params.productId as string,
    );

    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const updateProduct: Controller = async (req, res, next) => {
  try {
    const data = await productService.updateProduct(
      req.params.productId as string,
      req.body as UpdateProductPayload,
      req.file,
    );

    res.status(200).json({ success: true, message: "Product updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: Controller = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(
      req.params.productId as string,
    );

    res
      .status(200)
      .json({ success: true, message: "Product deleted", data: { product } });
  } catch (error) {
    next(error);
  }
};
