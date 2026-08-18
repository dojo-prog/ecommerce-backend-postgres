import pool from "../database/db";
import { CreateAddressPayload, UserAddress } from "../schemas/addresses";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (userId: string): Promise<UserAddress[]> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM addresses 
    WHERE user_id = $1
    `,
    [userId],
  );

  return rows;
};

export const findById = async (
  userId: string,
  addressId: string,
): Promise<UserAddress> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM addresses
    WHERE id = $1
      AND user_id = $2
    `,
    [addressId, userId],
  );

  return rows[0];
};

export const add = async (
  payload: CreateAddressPayload & { user_id: string },
) => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO addresses (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const update = async (
  userId: string,
  addressId: string,
  changes: Partial<UserAddress>,
): Promise<UserAddress> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(addressId, userId);

  const { rows } = await pool.query(
    `
    UPDATE addresses 
    ${setClause}
    WHERE id = $${values.length - 1}
      AND user_id = $${values.length}
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const remove = async (
  userId: string,
  addressId: string,
): Promise<void> => {
  await pool.query(
    `
    DELETE FROM addresses 
    WHERE id = $1
      AND user_id = $2
    `,
    [addressId, userId],
  );
};

export const setDefault = async (
  userId: string,
  addressId: string,
): Promise<UserAddress> => {
  await pool.query("BEGIN");

  try {
    await pool.query(
      `
      UPDATE addresses
      SET is_default = false 
      WHERE user_id = $1
        AND is_default = true
      `,
      [userId],
    );

    const { rows } = await pool.query(
      `
      UPDATE addresses 
      SET is_default = true
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [addressId, userId],
    );

    await pool.query("COMMIT");

    return rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};
