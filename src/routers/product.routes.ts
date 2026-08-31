import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CreateProductInputSchema,
  ProductParamsSchema,
  ProductQuerySchema,
  UpdateProductInputSchema,
} from "../schemas/products";
import multerUpload from "../middlewares/multer.middleware";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router
  .route("/")
  .get(readLimiter, validate({ query: ProductQuerySchema }), getProducts)
  .post(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    multerUpload.single("thumbnail"),
    validate({ body: CreateProductInputSchema }),
    createProduct,
  );

router
  .route("/:productId")
  .get(readLimiter, validate({ params: ProductParamsSchema }), getProductById)
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    multerUpload.single("thumbnail"),
    validate({ params: ProductParamsSchema, body: UpdateProductInputSchema }),
    updateProduct,
  )
  .delete(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: ProductParamsSchema }),
    deleteProduct,
  );

export default router;
