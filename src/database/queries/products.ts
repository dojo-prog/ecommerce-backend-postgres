export const PRODUCT_RELATIONS_PROJECTION = `
  p.*,

  jsonb_build_object(
    'id', c.id,
    'name', c.name
  ) AS category,

  jsonb_build_object(
    'id', sc.id,
    'name', sc.name
  ) AS subcategory,

  COALESCE(i.quantity, 0) AS stock_quantity
`;

export const PRODUCT_JOINS = `
  LEFT JOIN subcategories sc
    ON sc.id = p.subcategory_id
  LEFT JOIN categories c
    ON c.id = sc.category_id
  LEFT JOIN inventory i
    ON i.product_id = p.id
`;
