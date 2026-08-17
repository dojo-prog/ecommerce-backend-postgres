import express from "express";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  CreateShippingInputSchema,
  UpdateShippingInputSchema,
} from "../schemas/shipping";
import validate from "../middlewares/validation.middleware";
import {
  createShipping,
  deleteShipping,
  getShippingDetails,
  updateShipping,
} from "../controllers/shipping.controller";

const router = express.Router();

router
  .route("/")
  .get(getShippingDetails)
  .post(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: CreateShippingInputSchema }),
    createShipping,
  )
  .patch(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: UpdateShippingInputSchema }),
    updateShipping,
  )
  .delete(protectRoute, authorizeRoles(["admin"]), deleteShipping);

export default router;
