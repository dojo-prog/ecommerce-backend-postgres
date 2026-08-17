import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CreateStoreInputSchema,
  UpdateStoreInputSchema,
} from "../schemas/stores";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  createStore,
  deleteStore,
  getStoreDetails,
  updateStore,
} from "../controllers/store.controller";

const router = express.Router();

router
  .route("/")
  .get(getStoreDetails)
  .post(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: CreateStoreInputSchema }),
    createStore,
  )
  .patch(
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: UpdateStoreInputSchema }),
    updateStore,
  )
  .delete(protectRoute, authorizeRoles(["admin"]), deleteStore);

export default router;
