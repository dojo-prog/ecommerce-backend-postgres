import { PRODUCT_JOINS } from "./products";

export const CART_ITEM_RELATIONS_PROJECTION = `
  ci.quantity,
  ci.created_at,
  ci.updated_at,

  (
    to_jsonb(p)
    || jsonb_build_object(
      'category', jsonb_build_object(
        'id', c.id,
        'name', c.name
      ),
      'subcategory', jsonb_build_object(
        'id', sc.id,
        'name', sc.name
      ),
      'stock_quantity', COALESCE(i.quantity, 0)
    )
  ) AS product
`;

export const CART_ITEM_JOINS = `
  JOIN carts cart 
    ON cart.id = ci.cart_id 
  JOIN products p 
    ON p.id = ci.product_id
  ${PRODUCT_JOINS}
`;
