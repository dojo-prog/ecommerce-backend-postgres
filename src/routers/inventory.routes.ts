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

const router = express.Router();

router
  .route("/:productId/inventory")
  .put(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: ProductParamsSchema, body: UpdateInventoryInputSchema }),
    addInventoryStock,
  )
  .patch(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ params: ProductParamsSchema, body: UpdateInventoryInputSchema }),
    updateProductInventory,
  )
  .get(validate({ params: ProductParamsSchema }), getInventoryById);

export default router;
