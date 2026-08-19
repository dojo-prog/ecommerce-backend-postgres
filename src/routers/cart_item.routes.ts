import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import {
  AddToCartInputSchema,
  CartItemParamsSchema,
  CartItemQuerySchema,
  UpdateCartItemInputSchema,
} from "../schemas/cart_items";
import {
  addToCart,
  getCartItemById,
  getCartItems,
  removeFromCart,
  updateItemQuantity,
} from "../controllers/cart_items.controller";
import { ProductParamsSchema } from "../schemas/products";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(validate({ query: CartItemQuerySchema }), getCartItems)
  .post(validate({ body: AddToCartInputSchema }), addToCart);

router
  .route("/:productId")
  .get(validate({ params: ProductParamsSchema }), getCartItemById)
  .patch(
    validate({ params: ProductParamsSchema, body: UpdateCartItemInputSchema }),
    updateItemQuantity,
  )
  .delete(validate({ params: ProductParamsSchema }), removeFromCart);

export default router;
