import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CreateProductBodySchema,
  ProductIdParamsSchema,
  ProductQuerySchema,
  UpdateProductBodySchema,
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
    validate({ body: CreateProductBodySchema }),
    createProduct,
  );

router
  .route("/:productId")
  .get(readLimiter, validate({ params: ProductIdParamsSchema }), getProductById)
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    multerUpload.single("thumbnail"),
    validate({ params: ProductIdParamsSchema, body: UpdateProductBodySchema }),
    updateProduct,
  )
  .delete(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: ProductIdParamsSchema }),
    deleteProduct,
  );

export default router;
