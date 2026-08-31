import { PoolClient } from "pg";
import pool from "../database/db";
import { Order, OrderQuery } from "../schemas/orders";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import { CreateOrderData } from "../types/entities/order.types";

export const find = async (
  userId: string,
  filters: OrderQuery,
): Promise<Order[]> => {
  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    filters,
    ["user_id = $1"],
    [userId],
  );

  const { rows } = await pool.query(
    `
    SELECT * FROM orders
    ${whereClause}
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  return rows;
};

export const findById = async (
  userId: string,
  orderId: string,
  client?: PoolClient,
): Promise<Order> => {
  const conn = client ? client : pool;

  const { rows } = await conn.query(
    `
    SELECT * FROM orders
    WHERE id = $1
      AND user_id = $2
    `,
    [orderId, userId],
  );

  return rows[0];
};

export const create = async (
  client: PoolClient,
  payload: CreateOrderData,
): Promise<Order> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await client.query(
    `
    INSERT INTO orders (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const markAsPaid = async (orderId: string): Promise<Order> => {
  const { rows } = await pool.query(
    `
    UPDATE orders
    SET
      status = 'paid',
      paid_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
      AND status = 'pending'
    RETURNING *
    `,
    [orderId],
  );

  return rows[0];
};

export const cancel = async (
  orderId: string,
  client?: PoolClient,
): Promise<Order> => {
  const conn = client ? client : pool;

  const { rows } = await conn.query(
    `
    UPDATE orders
    SET
      status = 'cancelled',
      cancelled_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
      AND status = 'pending'
    RETURNING *
    `,
    [orderId],
  );

  return rows[0];
};
