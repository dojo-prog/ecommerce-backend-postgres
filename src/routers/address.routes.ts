import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import {
  AddressParamsSchema,
  CreateAddressInputSchema,
  UpdateAddressInputSchema,
} from "../schemas/addresses";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getUserAddresses,
  setToDefault,
  updateAddress,
} from "../controllers/address.controller";
import {
  readLimiter,
  writeLimiter,
} from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(readLimiter, getUserAddresses)
  .post(
    writeLimiter,
    validate({ body: CreateAddressInputSchema }),
    createAddress,
  );

router
  .route("/:addressId")
  .get(readLimiter, validate({ params: AddressParamsSchema }), getAddressById)
  .patch(
    writeLimiter,
    validate({ params: AddressParamsSchema, body: UpdateAddressInputSchema }),
    updateAddress,
  )
  .delete(
    writeLimiter,
    validate({ params: AddressParamsSchema }),
    deleteAddress,
  );

router.patch(
  "/:addressId/default",
  writeLimiter,
  validate({ params: AddressParamsSchema }),
  setToDefault,
);

export default router;
