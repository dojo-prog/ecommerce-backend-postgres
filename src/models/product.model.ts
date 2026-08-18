import pool from "../database/db";
import {
  PRODUCT_JOINS,
  PRODUCT_RELATIONS_PROJECTION,
} from "../database/queries/products";
import {
  CreateProductFinalPayload,
  CreateProductPayload,
  Product,
  ProductAllowableSort,
  ProductQueryPayload,
  ProductRelations,
} from "../schemas/products";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildProductSpecificFilters from "../utils/query-builder/buildProductSpecificFilters";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (
  filters: ProductQueryPayload,
): Promise<{ products: ProductRelations[]; total: number }> => {
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

export const findById = async (
  productId: string,
): Promise<ProductRelations> => {
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

export const findByName = async (name: string): Promise<ProductRelations> => {
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
  payload: CreateProductFinalPayload,
): Promise<ProductRelations> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO products (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING id;
    `,
    values,
  );

  const id = rows[0].id;

  return await findById(id);
};

export const update = async (
  productId: string,
  changes: Partial<Product>,
): Promise<ProductRelations> => {
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

  return await findById(productId);
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
