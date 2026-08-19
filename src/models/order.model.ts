import { PoolClient } from "pg";
import pool from "../database/db";
import {
  CreateOrderPayload,
  Order,
  OrderQueryPayload,
} from "../schemas/orders";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const find = async (
  userId: string,
  filters: OrderQueryPayload,
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
): Promise<Order> => {
  const { rows } = await pool.query(
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
  payload: CreateOrderPayload,
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
