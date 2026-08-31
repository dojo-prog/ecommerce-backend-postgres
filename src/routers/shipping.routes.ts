import express from "express";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  CreateShippingBodySchema,
  UpdateShippingBodySchema,
} from "../schemas/shippings";
import validate from "../middlewares/validation.middleware";
import {
  createShipping,
  deleteShipping,
  getShippingDetails,
  updateShipping,
} from "../controllers/shipping.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router
  .route("/")
  .get(readLimiter, getShippingDetails)
  .post(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: CreateShippingBodySchema }),
    createShipping,
  )
  .patch(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: UpdateShippingBodySchema }),
    updateShipping,
  )
  .delete(
    writeLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    deleteShipping,
  );

export default router;
