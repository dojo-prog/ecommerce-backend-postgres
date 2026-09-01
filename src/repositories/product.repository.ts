import pool from "../database/db";
import {
  PRODUCT_JOINS,
  PRODUCT_RELATIONS_PROJECTION,
} from "../database/queries/products";
import {
  Product,
  ProductAllowableSort,
  ProductQuery,
  ProductWithRelations,
} from "../schemas/products";
import { CreateProductData } from "../types/entities/product.types";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildProductSpecificFilters from "../utils/query-builder/buildProductSpecificFilters";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (
  filters: ProductQuery,
): Promise<{ products: ProductWithRelations[]; total: number }> => {
  const { category, minPrice, maxPrice, inStock, ...generic } = filters;
  const specific = { category, minPrice, maxPrice, inStock };

  const { conditions: baseCon, values: baseVal } =
    buildProductSpecificFilters(specific);

  const { whereClause, orderByClause, limitClause, offsetClause, values } =
    buildFilterQueries(
      generic,
      baseCon,
      baseVal,
      ["p.name"],
      ProductAllowableSort.options,
    );

  const { rows } = await pool.query(
    `
    SELECT ${PRODUCT_RELATIONS_PROJECTION},
      COUNT(*) OVER()::INT AS total
    FROM products p
    ${PRODUCT_JOINS}
    ${whereClause}
    ${orderByClause}
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const products = rows.map(({ total, ...product }) => product);

  return {
    products,
    total: rows[0]?.total ?? 0,
  };
};

export const findById = async (productId: string) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM products
    WHERE id = $1
    `,
    [productId],
  );

  return rows[0];
};

export const findWithRelationsById = async (
  productId: string,
): Promise<ProductWithRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${PRODUCT_RELATIONS_PROJECTION}
    FROM products p
    ${PRODUCT_JOINS}
    WHERE p.id = $1
    `,
    [productId],
  );

  return rows[0];
};

export const findByName = async (
  name: string,
): Promise<ProductWithRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${PRODUCT_RELATIONS_PROJECTION}
    FROM products p
    ${PRODUCT_JOINS}
    WHERE LOWER(p.name) = LOWER($1)
    `,
    [name],
  );

  return rows[0];
};

export const add = async (
  payload: CreateProductData,
): Promise<{ id: string }> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO products (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING id;
    `,
    values,
  );

  return rows[0];
};

export const update = async (
  productId: string,
  changes: Partial<Product>,
): Promise<ProductWithRelations> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(productId);

  await pool.query(
    `
    UPDATE products
    ${setClause}
    WHERE id = $${values.length}
    `,
    values,
  );

  return await findWithRelationsById(productId);
};

export const remove = async (productId: string): Promise<void> => {
  await pool.query(
    `
    DELETE FROM products
    WHERE id = $1
    `,
    [productId],
  );
};
