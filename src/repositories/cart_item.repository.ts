import { PoolClient } from "pg";
import pool from "../database/db";
import {
  CART_ITEM_JOINS,
  CART_ITEM_RELATIONS_PROJECTION,
} from "../database/queries/cart_items";
import { CartItemQuery, CartItemWithRelations } from "../schemas/cart_items";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import { AddToCartData } from "../types/entities/cart_item.types";

export const find = async (
  userId: string,
  filters: CartItemQuery,
): Promise<{ cart_items: CartItemWithRelations[]; total: number }> => {
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
): Promise<CartItemWithRelations[]> => {
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
): Promise<CartItemWithRelations> => {
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
  data: AddToCartData,
): Promise<CartItemWithRelations> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(data);

  await pool.query(
    `
    INSERT INTO cart_items (${columnsStr})
    VALUES (${placeholdersStr})
    `,
    values,
  );

  return await findById(userId, data.product_id);
};

export const update = async (
  userId: string,
  productId: string,
  changes: { quantity: number },
): Promise<CartItemWithRelations> => {
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
