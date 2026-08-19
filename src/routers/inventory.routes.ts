import express from "express";
import validate from "../middlewares/validation.middleware";
import { ProductParamsSchema } from "../schemas/products";
import { UpdateInventoryInputSchema } from "../schemas/inventory";
import {
  addInventoryStock,
  getInventoryById,
  UpdateProductInventory,
} from "../controllers/inventory.controller";

const router = express.Router();

router
  .route("/:productId/inventory")
  .post(
    validate({ params: ProductParamsSchema, body: UpdateInventoryInputSchema }),
    addInventoryStock,
  )
  .patch(
    validate({ params: ProductParamsSchema, body: UpdateInventoryInputSchema }),
    UpdateProductInventory,
  )
  .get(validate({ params: ProductParamsSchema }), getInventoryById);

export default router;
