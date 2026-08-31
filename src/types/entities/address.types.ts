import { UserAddress } from "../../schemas/addresses";
import { UpdateResult } from "./common";

// =======================================
// RESULT
// =======================================

export type UpdateAddressResult = UpdateResult<"address", UserAddress>;
