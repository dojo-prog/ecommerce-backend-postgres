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

const router = express.Router();

router
  .route("/")
  .get(validate({ query: ProductQuerySchema }), getProducts)
  .post(
    protectRoute,
    authorizeRoles(["admin"]),
    multerUpload.single("thumbnail"),
    validate({ body: CreateProductInputSchema }),
    createProduct,
  );

router
  .route("/:productId")
  .get(validate({ params: ProductParamsSchema }), getProductById)
  .patch(
    protectRoute,
    authorizeRoles(["admin"]),
    multerUpload.single("thumbnail"),
    validate({ params: ProductParamsSchema, body: UpdateProductInputSchema }),
    updateProduct,
  )
  .delete(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: ProductParamsSchema }),
    deleteProduct,
  );

export default router;
