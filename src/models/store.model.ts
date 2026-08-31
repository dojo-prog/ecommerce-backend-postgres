import { PoolClient } from "pg";
import pool from "../database/db";
import { CreateStoreBody, Store } from "../schemas/stores";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (client?: PoolClient): Promise<Store> => {
  const conn = client ? client : pool;

  const { rows } = await conn.query(
    `
    SELECT * FROM stores;
    `,
  );

  return rows[0];
};

export const create = async (
  payload: CreateStoreBody & { latitude: number; longitude: number },
): Promise<Store> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO stores (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const update = async (
  storeId: string,
  changes: Partial<Store>,
): Promise<Store> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(storeId);

  const { rows } = await pool.query(
    `
    UPDATE stores 
    ${setClause}
    WHERE id = $${values.length}
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const remove = async (storeId: string): Promise<void> => {
  await pool.query(
    `
    DELETE FROM stores
    WHERE id = $1
    `,
    [storeId],
  );
};
