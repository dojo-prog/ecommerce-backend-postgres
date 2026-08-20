import { PoolClient } from "pg";
import pool from "../database/db";
import { CreateOrderItemPayload, OrderItem } from "../schemas/order_items";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const findByOrderIds = async (
  orderIds: string[],
): Promise<OrderItem[]> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM order_items
    WHERE order_id = ANY($1::uuid[])
    `,
    [orderIds],
  );

  return rows;
};

export const findByOrderId = async (
  orderId: string,
  client?: PoolClient,
): Promise<OrderItem[]> => {
  const conn = client ? client : pool;

  const { rows } = await conn.query(
    `
    SELECT * FROM order_items
    WHERE order_id = $1
    `,
    [orderId],
  );

  return rows;
};

export const add = async (
  client: PoolClient,
  payload: CreateOrderItemPayload,
): Promise<OrderItem> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await client.query(
    `
    INSERT INTO order_items (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};
