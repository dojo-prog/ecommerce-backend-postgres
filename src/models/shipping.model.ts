import pool from "../database/db";
import { CreateShippingPayload, Shipping } from "../schemas/shipping";
import buildInserQueries from "../utils/query-builder/buildInsertQueries";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (): Promise<Shipping> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM shipping;
    `,
  );

  return rows[0];
};

export const create = async (
  payload: CreateShippingPayload,
): Promise<Shipping> => {
  const { columnsStr, placeholdersStr, values } = buildInserQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO shipping (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const update = async (
  shippingId: string,
  changes: Partial<Shipping>,
): Promise<Shipping> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(shippingId);

  const { rows } = await pool.query(
    `
    UPDATE shipping 
    ${setClause}
    WHERE id = $${values.length}
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const remove = async (shippingId: string): Promise<void> => {
  await pool.query(
    `
    DELETE FROM shipping
    WHERE id = $1
    `,
    [shippingId],
  );
};
