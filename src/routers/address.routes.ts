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
  updateAddress,
} from "../controllers/address.controller";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(getUserAddresses)
  .post(validate({ body: CreateAddressInputSchema }), createAddress);

router
  .route("/:addressId")
  .get(validate({ params: AddressParamsSchema }), getAddressById)
  .patch(
    validate({ params: AddressParamsSchema, body: UpdateAddressInputSchema }),
    updateAddress,
  )
  .delete(validate({ params: AddressParamsSchema }), deleteAddress);

export default router;
