import { PoolClient } from "pg";
import pool from "../database/db";
import { Cart } from "../schemas/carts";

export const findById = async (
  userId: string,
  client?: PoolClient,
): Promise<Cart> => {
  const conn = client ? client : pool;

  const { rows } = await conn.query(
    `
    SELECT * FROM carts
    WHERE user_id = $1
    `,
    [userId],
  );

  return rows[0];
};

export const findByUserId = async (userId: string): Promise<Cart> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM carts
    WHERE user_id = $1
    `,
    [userId],
  );

  return rows[0];
};

export const add = async (userId: string): Promise<Cart> => {
  const { rows } = await pool.query(
    `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING *
    `,
    [userId],
  );

  return rows[0];
};
