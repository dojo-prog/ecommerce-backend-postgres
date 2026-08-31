import express from "express";
import validate from "../middlewares/validation.middleware";
import { ProductIdParamsSchema } from "../schemas/products";
import { UpdateInventoryBodySchema } from "../schemas/inventories";
import {
  addInventoryStock,
  getInventoryById,
  updateProductInventory,
} from "../controllers/inventory.controller";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router
  .route("/:productId/inventory")
  .put(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: ProductIdParamsSchema,
      body: UpdateInventoryBodySchema,
    }),
    addInventoryStock,
  )
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({
      params: ProductIdParamsSchema,
      body: UpdateInventoryBodySchema,
    }),
    updateProductInventory,
  )
  .get(
    readLimiter,
    validate({ params: ProductIdParamsSchema }),
    getInventoryById,
  );

export default router;
