import express from "express";
import validate from "../middlewares/validation.middleware";
import { ProductParamsSchema } from "../schemas/products";
import { UpdateInventoryInputSchema } from "../schemas/inventory";
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
    validate({ params: ProductParamsSchema, body: UpdateInventoryInputSchema }),
    addInventoryStock,
  )
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: ProductParamsSchema, body: UpdateInventoryInputSchema }),
    updateProductInventory,
  )
  .get(
    readLimiter,
    validate({ params: ProductParamsSchema }),
    getInventoryById,
  );

export default router;
