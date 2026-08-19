import pool from "../database/db";
import { Inventory, UpdateInventoryPayload } from "../schemas/inventory";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const findById = async (productId: string): Promise<Inventory> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM inventory
    WHERE product_id = $1
    `,
    [productId],
  );

  return rows[0];
};

export const add = async (
  productId: string,
  quantity: number,
): Promise<Inventory> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries({
    product_id: productId,
    quantity,
  });

  const { rows } = await pool.query(
    `
    INSERT INTO inventory (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const update = async (
  productId: string,
  changes: UpdateInventoryPayload,
): Promise<void> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(productId);

  await pool.query(
    `
    UPDATE inventory 
    ${setClause}
    WHERE product_id = $${values.length}
    `,
    values,
  );
};
