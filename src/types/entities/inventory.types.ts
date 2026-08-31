import { Inventory } from "../../schemas/inventories";
import { UpdateResult } from "./common";

// =======================================
// RESULT
// =======================================

export type UpdateInvetoryResult = UpdateResult<"inventory", Inventory>;
