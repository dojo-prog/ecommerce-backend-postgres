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
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(readLimiter, validate({ query: CartItemQuerySchema }), getCartItems)
  .post(writeLimiter, validate({ body: AddToCartInputSchema }), addToCart);

router
  .route("/:productId")
  .get(readLimiter, validate({ params: ProductParamsSchema }), getCartItemById)
  .patch(
    writeLimiter,
    validate({ params: ProductParamsSchema, body: UpdateCartItemInputSchema }),
    updateItemQuantity,
  )
  .delete(
    writeLimiter,
    validate({ params: ProductParamsSchema }),
    removeFromCart,
  );

export default router;
