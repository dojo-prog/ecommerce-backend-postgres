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

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(validate({ query: CartItemQuerySchema }), getCartItems)
  .post(validate({ body: AddToCartInputSchema }), addToCart);

router
  .route("/:cartItemId")
  .get(validate({ params: CartItemParamsSchema }), getCartItemById)
  .patch(
    validate({ params: CartItemParamsSchema, body: UpdateCartItemInputSchema }),
    updateItemQuantity,
  )
  .delete(validate({ params: CartItemParamsSchema }), removeFromCart);

export default router;
