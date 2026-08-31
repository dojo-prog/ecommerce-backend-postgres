import pool from "../database/db";
import { CreatePaymentData } from "../types/entities/payment.types";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const findById = async (paymentId: string) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM payments 
    WHERE id = $1
    `,
    [paymentId],
  );

  return rows[0];
};

export const findByOrderId = async (orderId: string) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM payments 
    WHERE order_id = $1
    `,
    [orderId],
  );

  return rows[0];
};

export const findByTransactionId = async (transactionId: string) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM payments 
    WHERE transaction_id = $1
    `,
    [transactionId],
  );

  return rows[0];
};

export const create = async (payload: CreatePaymentData) => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO payments (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *
    `,
    values,
  );

  return rows[0];
};
