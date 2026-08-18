import pool from "../database/db";
import {
  Category,
  CategoryQueryPayload,
  CreateCategoryPayload,
} from "../schemas/categories";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (
  filters: CategoryQueryPayload,
): Promise<{ categories: Category[]; total: number }> => {
  const { whereClause, orderByClause, limitClause, offsetClause, values } =
    buildFilterQueries(filters, [], [], ["name"]);

  const { rows } = await pool.query(
    `
    SELECT *,
      COUNT(*) OVER()::INT AS total
    FROM categories 
    ${whereClause}
    ${orderByClause}
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const categories = rows.map(({ total, ...category }) => category);

  return {
    categories,
    total: rows[0]?.total ?? 0,
  };
};

export const findById = async (categoryId: string): Promise<Category> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM categories
    WHERE id = $1
    `,
    [categoryId],
  );

  return rows[0];
};

export const findBySlug = async (categorySlug: string): Promise<Category> => {
  const { rows } = await pool.query(
    `
    SELECT * FROM categories
    WHERE slug = $1
    `,
    [categorySlug],
  );

  return rows[0];
};

export const add = async (
  payload: CreateCategoryPayload & { slug: string },
) => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const { rows } = await pool.query(
    `
    INSERT INTO categories (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING *;
    `,
    values,
  );

  return rows[0];
};

export const update = async (
  categoryId: string,
  changes: Partial<Category>,
) => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(categoryId);

  const { rows } = await pool.query(
    `
    UPDATE categories 
    ${setClause}
    WHERE id = $${values.length}
    RETURNING *
    `,
    values,
  );

  return rows[0];
};

export const remove = async (categoryId: string): Promise<void> => {
  await pool.query(
    `
    DELETE FROM categories
    WHERE id = $1
    `,
    [categoryId],
  );
};
