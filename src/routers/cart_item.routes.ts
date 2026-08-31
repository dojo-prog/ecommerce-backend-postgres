import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import {
  AddToCartBodySchema,
  CartItemQuerySchema,
  UpdateCartItemBodySchema,
} from "../schemas/cart_items";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";
import {
  addToCart,
  getCartItemById,
  getCartItems,
  removeFromCart,
  updateItemQuantity,
} from "../controllers/cart_items.controller";
import { ProductIdParamsSchema } from "../schemas/products";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(readLimiter, validate({ query: CartItemQuerySchema }), getCartItems)
  .post(writeLimiter, validate({ body: AddToCartBodySchema }), addToCart);

router
  .route("/:productId")
  .get(
    readLimiter,
    validate({ params: ProductIdParamsSchema }),
    getCartItemById,
  )
  .patch(
    writeLimiter,
    validate({ params: ProductIdParamsSchema, body: UpdateCartItemBodySchema }),
    updateItemQuantity,
  )
  .delete(
    writeLimiter,
    validate({ params: ProductIdParamsSchema }),
    removeFromCart,
  );

export default router;
