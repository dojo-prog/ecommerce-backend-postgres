import { PoolClient } from "pg";
import pool from "../database/db";
import { Inventory, UpdateInventoryBody } from "../schemas/inventories";
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
  changes: UpdateInventoryBody,
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

export const decrement = async (
  client: PoolClient,
  productId: string,
  quantity: number,
): Promise<{ quantity: number }> => {
  const { rows } = await client.query(
    `
    UPDATE inventory 
    SET quantity = quantity - $1
    WHERE product_id = $2
      AND quantity >= $1
    RETURNING quantity 
    `,
    [quantity, productId],
  );

  return rows[0];
};

export const increment = async (
  client: PoolClient,
  productId: string,
  quantity: number,
): Promise<void> => {
  await client.query(
    `
    UPDATE inventory
    SET quantity = quantity + $1
    WHERE product_id = $2
    `,
    [quantity, productId],
  );
};
