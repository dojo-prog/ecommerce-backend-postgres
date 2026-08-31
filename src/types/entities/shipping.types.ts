import { Shipping } from "../../schemas/shippings";
import { UpdateResult } from "./common";

// =======================================
// RESULT
// =======================================

export type UpdateShippingResult = UpdateResult<"shipping", Shipping>;
