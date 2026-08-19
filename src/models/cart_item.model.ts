import { PoolClient } from "pg";
import pool from "../database/db";
import {
  CART_ITEM_JOINS,
  CART_ITEM_RELATIONS_PROJECTION,
} from "../database/queries/cart_items";
import {
  AddToCartPayload,
  CartItemQueryPayload,
  CartItemRelations,
} from "../schemas/cart_items";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const find = async (
  userId: string,
  filters: CartItemQueryPayload,
): Promise<{ cart_items: CartItemRelations[]; total: number }> => {
  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    filters,
    ["cart.user_id = $1"],
    [userId],
    ["p.name"],
  );

  const { rows } = await pool.query(
    `
    SELECT ${CART_ITEM_RELATIONS_PROJECTION},
      COUNT(*) OVER()::INT AS total
    FROM cart_items ci
    ${CART_ITEM_JOINS}
    ${whereClause}
    ORDER BY ci.created_at DESC
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const cart_items = rows.map(({ total, ...cart_item }) => cart_item);

  return {
    cart_items,
    total: rows[0]?.total ?? 0,
  };
};

export const findByCartId = async (
  cartId: string,
  client?: PoolClient,
): Promise<CartItemRelations[]> => {
  const conn = client ? client : pool;

  const { rows } = await conn.query(
    `
    SELECT ${CART_ITEM_RELATIONS_PROJECTION}
    FROM cart_items ci 
    ${CART_ITEM_JOINS}
    WHERE ci.cart_id = $1
    `,
    [cartId],
  );

  return rows ?? [];
};

export const findById = async (
  userId: string,
  productId: string,
): Promise<CartItemRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${CART_ITEM_RELATIONS_PROJECTION}
    FROM cart_items ci 
    ${CART_ITEM_JOINS}
    WHERE ci.product_id = $1
      AND cart.user_id = $2
    `,
    [productId, userId],
  );

  return rows[0];
};

export const add = async (
  userId: string,
  payload: AddToCartPayload & { cart_id: string },
): Promise<CartItemRelations> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  await pool.query(
    `
    INSERT INTO cart_items (${columnsStr})
    VALUES (${placeholdersStr})
    `,
    values,
  );

  return await findById(userId, payload.product_id);
};

export const update = async (
  userId: string,
  productId: string,
  changes: { quantity: number },
): Promise<CartItemRelations> => {
  await pool.query(
    `
    UPDATE cart_items ci
    SET quantity = $1
    FROM carts cart
    WHERE ci.product_id = $2
      AND ci.cart_id = cart.id
      AND cart.user_id = $3
    `,
    [changes.quantity, productId, userId],
  );

  return await findById(userId, productId);
};

export const remove = async (
  userId: string,
  product_id: string,
): Promise<void> => {
  await pool.query(
    `
    DELETE FROM cart_items ci
    USING carts cart 
    WHERE ci.cart_id = cart.id
      AND ci.product_id = $1
      AND cart.user_id = $2
    `,
    [product_id, userId],
  );
};

export const removeAllByCartId = async (
  client: PoolClient,
  cartId: string,
): Promise<void> => {
  await client.query(
    `
    DELETE FROM cart_items ci
    USING carts cart
      WHERE cart.id = $1
    `,
    [cartId],
  );
};
