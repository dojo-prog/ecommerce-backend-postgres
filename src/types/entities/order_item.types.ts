// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateOrderItemData {
  order_id: string;
  product_id: string;
  product_name: string;
  product_thumbnail_url: string | null;
  quantity: number;
  unit_price_cents: number;
  subtotal_cents: number;
}
