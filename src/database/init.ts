import pool from "./db";

const initDb = async () => {
  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL UNIQUE,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'customer',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      region text NOT NULL,
      province text NOT NULL,
      city text NOT NULL,
      barangay text NOT NULL,
      address_line text NOT NULL,
      latitude double precision NOT NULL,
      longitude double precision NOT NULL,
      is_default boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS stores (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL UNIQUE,
      region text NOT NULL,
      province text NOT NULL,
      city text NOT NULL,
      barangay text NOT NULL,
      address_line text NOT NULL,
      latitude double precision NOT NULL,
      longitude double precision NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS shipping (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL UNIQUE,
      base_fee_cents int NOT NULL CHECK (base_fee_cents >= 0),
      fee_per_km_cents int NOT NULL CHECK (fee_per_km_cents >= 0)
    );

    CREATE TABLE IF NOT EXISTS categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL UNIQUE,
      slug text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS subcategories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id uuid NOT NULL REFERENCES categories(id) 
        ON DELETE CASCADE,
      name text NOT NULL,
      slug text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),

      UNIQUE (category_id, name),
      UNIQUE (category_id, slug)
    );

    CREATE TABLE IF NOT EXISTS products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      subcategory_id uuid REFERENCES subcategories(id)
        ON DELETE SET NULL,
      name text NOT NULL UNIQUE, 
      description text NOT NULL, 
      price_cents int NOT NULL CHECK (price_cents >= 0),
      currency text NOT NULL DEFAULT 'PHP',
      weight_grams int NOT NULL CHECK (weight_grams >= 0), 
      is_active boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS inventory (
      product_id uuid PRIMARY KEY 
        REFERENCES products(id)
        ON DELETE CASCADE,
      quantity int NOT NULL CHECK (quantity >= 0), 
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS carts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),

      UNIQUE (user_id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      cart_id uuid NOT NULL REFERENCES carts(id)
        ON DELETE CASCADE,
      product_id uuid NOT NULL REFERENCES products(id)
        ON DELETE CASCADE,
      quantity int NOT NULL CHECK (quantity >= 0), 
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),

      PRIMARY KEY (cart_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES users(id)
        ON DELETE SET NULL, 
      status text NOT NULL DEFAULT 'pending',
      subtotal_cents int NOT NULL CHECK (subtotal_cents >= 0), 
      tax_cents int NOT NULL CHECK (tax_cents >= 0), 
      shipping_fee_cents int NOT NULL CHECK (shipping_fee_cents >= 0), 
      shipping_distance_meters int NOT NULL CHECK (shipping_distance_meters >= 0),
      total_cents int NOT NULL CHECK (total_cents >= 0), 
      timestamps jsonb NOT NULL DEFAULT '{
        "paid_at": null,
        "shipped_at": null,
        "delivered_at": null,
        "cancelled_at": null
      }'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid NOT NULL REFERENCES orders(id)
        ON DELETE CASCADE,
      product_id uuid REFERENCES products(id)
        ON DELETE SET NULL, 
      quantity int NOT NULL CHECK (quantity >= 0), 
      unit_price_cents int NOT NULL CHECK (unit_price_cents >= 0), 
      subtotal_cents int NOT NULL CHECK (subtotal_cents >= 0)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid NOT NULL REFERENCES orders(id)
        ON DELETE RESTRICT, 
      amount_cents int NOT NULL CHECK (amount_cents >= 0), 
      status text NOT NULL DEFAULT 'pending',
      provider text NOT NULL DEFAULT 'mock',
      transaction_id text NOT NULL UNIQUE
    );

    CREATE INDEX IF NOT EXISTS idx_addresses_user_id 
    ON addresses (user_id);

    CREATE INDEX IF NOT EXISTS idx_subcategories_category_id
    ON subcategories (category_id);

    CREATE INDEX IF NOT EXISTS idx_products_subcategory_id
    ON products (subcategory_id);

    CREATE INDEX IF NOT EXISTS idx_cart_items_product_id 
    ON cart_items (product_id);

    CREATE INDEX IF NOT EXISTS idx_orders_user_id
    ON orders (user_id);

    CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items (order_id);

    CREATE INDEX IF NOT EXISTS idx_payments_order_id
    ON payments (order_id);
    `,
  );
};

initDb();
