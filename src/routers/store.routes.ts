import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  CreateStoreBodySchema,
  UpdateStoreBodySchema,
} from "../schemas/stores";
import { authorizeRoles, protectRoute } from "../middlewares/auth.middleware";
import {
  createStore,
  deleteStore,
  getStoreDetails,
  updateStore,
} from "../controllers/store.controller";
import { readLimiter } from "../middlewares/rate.limit.middlewares";

const router = express.Router();

router
  .route("/")
  .get(readLimiter, getStoreDetails)
  .post(
    readLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: CreateStoreBodySchema }),
    createStore,
  )
  .patch(
    readLimiter,
    protectRoute,
    authorizeRoles(["admin"]),
    validate({ body: UpdateStoreBodySchema }),
    updateStore,
  )
  .delete(protectRoute, authorizeRoles(["admin"]), deleteStore);

export default router;
