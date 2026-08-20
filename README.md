# E-Commerce Backend API

A **full-featured, single-store e-commerce backend** built with **Express 5**, **TypeScript**, **PostgreSQL** (`pg`), and role-aware **JWT authentication**. This is the most ambitious project in the series so far — 12 relational tables spanning catalog (categories → subcategories → products → inventory), commerce (cart → checkout → orders → order items → payments), and logistics (user addresses, a single store location, distance-based shipping), plus two real third-party integrations: **Cloudinary** for product image uploads and **OpenStreetMap Nominatim** for address geocoding.

---

## ✨ Features

- **JWT authentication** with access & refresh tokens as `httpOnly` cookies, plus **role-based authorization** (`admin` / `customer`) — consistent with the auth pattern established earlier in this series
- **Catalog hierarchy**: categories → subcategories → products, each with slugs, and admin-only writes
- **Product image uploads** via `multer` (in-memory, 5MB/file limit, JPEG/PNG/WebP only) piped directly to **Cloudinary** — no images ever touch local disk
- **Inventory tracking** decoupled from products (`inventory` table keyed by `product_id`), with dedicated stock-add and stock-set endpoints
- **Shopping cart** — one cart per user (enforced via a `UNIQUE(user_id)` constraint), with quantity-based add/update/remove
- **A real checkout flow**, wrapped in a single Postgres transaction (`BEGIN`/`COMMIT`/`ROLLBACK`):
  1. Locks in cart contents and atomically decrements inventory per line item (rolling back the whole order if any item is out of stock)
  2. Computes straight-line shipping distance between the user's chosen address and the store's location (`calculateDistanceMeters`, Haversine-style)
  3. Calculates tax (12%) and a distance-based shipping fee (`base_fee + per_km_fee × distance`)
  4. Creates the order + order line items, then clears the cart
- **Mock payment processing** — a `payOrder` flow that simulates a payment provider, and on failure automatically cancels the order and restores inventory in the same transactional style as checkout
- **Order cancellation logic exists at the service layer** (`orderService.cancelOrder`), correctly restoring inventory — see the Roadmap for a note on wiring it up to a route
- **User addresses** geocoded via the **Nominatim** (OpenStreetMap) API on create/update, with a business rule capping users at 3 saved addresses and a "set as default" endpoint
- **Single-store, single-shipping-config design**, enforced at the database level with a clever `CREATE UNIQUE INDEX ... ON stores ((true))` trick — guarantees at most one row can ever exist in `stores` and `shipping`, without needing application-level checks
- **A seeding system** (`npm run seed:db`) covering users, categories, subcategories, products, stores, and shipping config
- **Schema validation on every request** using Zod v4, with a well-organized shared primitives file (`UUIDSchema`, `SlugSchema`, `DecimalSchema`, `NonNegativeIntSchema`, pagination, etc.) reused across every resource
- **Fail-fast environment config** (`config/env.ts`) — the app refuses to start if any required env var (DB credentials, JWT secrets, Cloudinary keys) is missing, with a clear error naming exactly which one
- **Centralized error handling** via a custom `AppError` class and an Express error-handling middleware
- **Strict TypeScript** throughout, including typed Express handlers and an augmented `Request` type carrying `req.user`
- **Postman collection** covering all nine resource groups, committed at `docs/E-COMM-BACKEND.postman_collection`

---

## 🧱 Tech Stack

| Layer            | Technology                          |
| ------------------ | -------------------------------------- |
| Runtime              | Node.js                                |
| Language             | TypeScript                             |
| Web Framework        | Express 5                              |
| Validation           | Zod v4                                 |
| Database             | PostgreSQL (via `pg`)                  |
| Authentication       | JSON Web Tokens (`jsonwebtoken`) + `httpOnly` cookies (`cookie-parser`) |
| Password Hashing     | `bcryptjs`                             |
| File Uploads         | `multer` (memory storage)              |
| Image Hosting        | Cloudinary                             |
| Geocoding            | OpenStreetMap Nominatim                |
| Dev Tooling          | tsx (TypeScript execution & watch)     |
| Config               | dotenv                                 |

---

## 📁 Project Structure

```
e-comm-backend/
├── docs/
│   └── E-COMM-BACKEND.postman_collection # full Postman collection, already committed
├── seed/
│   ├── index.ts                       # Orchestrates all seed scripts in dependency order
│   ├── utils.ts                       # Shared seeding helpers
│   └── users/ categories/ subcategories/ products/ stores/ shipping/
│       └── data.ts + seed.ts          # Static data + insert logic, per resource
├── src/
│   ├── app.ts                         # Express app setup — mounts all routers under /api/v1
│   ├── server.ts                      # HTTP server bootstrap (DB check + init)
│   ├── config/
│   │   └── env.ts                     # Fail-fast validated environment variable access
│   ├── constants/
│   │   └── auth.ts                    # Cookie names/options for auth tokens
│   ├── controllers/                   # auth, address, store, shipping, category, subcategory,
│   │                                   # product, inventory, cart_items, order, payment
│   ├── database/
│   │   ├── db.ts                      # pg Pool connection
│   │   ├── init.ts                    # Schema migration — creates all 12 tables + indexes
│   │   ├── check.ts                   # Verifies DB connectivity at boot
│   │   └── queries/                   # Shared SQL projections (users, products, cart_items)
│   ├── integrations/
│   │   ├── cloudinary/                # client.ts, upload.ts, delete.ts — product image hosting
│   │   ├── mockPayment/               # process.ts — simulated payment provider
│   │   └── nominatim/                 # geocoding.ts — address → lat/lon via OpenStreetMap
│   ├── middlewares/
│   │   ├── auth.middleware.ts         # protectRoute (JWT check) + authorizeRoles (RBAC)
│   │   ├── error.middleware.ts        # Global error handler
│   │   ├── multer.middleware.ts       # In-memory upload handling, file type/size limits
│   │   └── validation.middleware.ts   # Zod-based request validation (params/body/query)
│   ├── models/                        # one file per resource — the only layer touching the DB
│   ├── routers/                       # one router per resource, mounted in app.ts
│   ├── schemas/                       # one Zod schema file per resource + shared common.ts
│   ├── types/
│   │   ├── express.d.ts               # Augments Express's Request with `user`
│   │   └── handlers.ts                # Shared Controller/Middleware types
│   └── utils/
│       ├── AppError.ts                # Custom operational error class
│       ├── generateChanges.ts         # Diffs incoming payload against the existing record
│       ├── generateSlug.ts            # Generates URL-safe slugs
│       ├── calculateDistanceMeters.ts # Straight-line distance between two lat/lon points
│       ├── auth/                      # generateAuthTokens.ts, setAuthCookies.ts
│       └── query-builder/             # buildFilterQueries, buildInsertQueries,
│                                       # buildUpdateQueries, buildProductSpecificFilters
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

```
Router → protectRoute / authorizeRoles (as applicable) → multer (where uploads apply) → Middleware (validation) → Controller → Service → Model → PostgreSQL
```

Checkout and payment failure/cancellation are the two places business logic spans multiple models within a single database transaction (via a shared `pg` client passed down through the model layer) — worth studying `order.service.ts` as the reference example for transactional writes in this series.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm
- A running **PostgreSQL** instance (local install, Docker, or a hosted service like Supabase/Neon/RDS)
- A free [Cloudinary](https://cloudinary.com/) account (for product image uploads)

### Installation

```bash
git clone <your-repo-url>
cd e-comm-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root (already gitignored — good, this repo doesn't commit real secrets):

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=e_comm_backend
DATABASE_USER=postgres
DATABASE_PASSWORD=<your-postgres-password>

ACCESS_TOKEN_SECRET=<a-long-random-secret>
REFRESH_TOKEN_SECRET=<a-different-long-random-secret>

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

Every one of these is required — `config/env.ts` throws immediately at startup naming the specific missing variable, rather than failing confusingly later at request time.

### Running the App

```bash
npm run dev
```

On startup, `src/database/check.ts` verifies the PostgreSQL connection and `src/database/init.ts` automatically creates all 12 tables and indexes if they don't already exist.

**Seed the database with sample data:**

```bash
npm run seed:db
```

Populates users, categories, subcategories, products, the single store record, and the single shipping config — in dependency order.

**Production mode:**

```bash
npm run build
npm start
```

Once running, the API will be available at:

```
http://localhost:3000/api/v1
```

---

## 🔐 Authentication

| Method | Endpoint                | Auth required | Description                                             |
| ------ | ------------------------ | -------------- | ----------------------------------------------------------|
| `POST` | `/api/v1/auth/register`  | No             | Create a new account (`username`, `email`, `password`, `confirm_password`) |
| `POST` | `/api/v1/auth/login`     | No             | Log in with `email` + `password`                          |
| `POST` | `/api/v1/auth/logout`    | No             | Clear the access & refresh token cookies                  |
| `POST` | `/api/v1/auth/refresh`   | No (needs valid refresh cookie) | Issue a new access token                    |
| `GET`  | `/api/v1/auth/me`        | Yes            | Get the currently authenticated user                       |

---

## 📍 Addresses API

Base URL: `/api/v1/addresses` — **requires authentication.**

| Method   | Endpoint                | Description                                              |
| -------- | -------------------------- | -----------------------------------------------------------|
| `GET`    | `/`                           | List the current user's saved addresses                   |
| `POST`   | `/`                           | Add a new address (max 3 per user) — auto-geocoded via Nominatim |
| `GET`    | `/:addressId`                 | Get a single address                                       |
| `PATCH`  | `/:addressId`                 | Update an address (re-geocoded if location fields change)  |
| `DELETE` | `/:addressId`                 | Delete an address                                           |
| `PATCH`  | `/:addressId/default`         | Mark an address as the default                              |

---

## 🏬 Store API

Base URL: `/api/v1/store` — single-row resource (see Data Model)

| Method   | Endpoint | Auth       | Description                          |
| -------- | ---------- | ------------| ---------------------------------------|
| `GET`    | `/`          | Public         | Get the store's location                |
| `POST`   | `/`          | `admin` only   | Create the store (only succeeds once)   |
| `PATCH`  | `/`          | `admin` only   | Update the store's location             |
| `DELETE` | `/`          | `admin` only   | Delete the store record                 |

## 🚚 Shipping API

Base URL: `/api/v1/shipping` — single-row resource (see Data Model)

| Method   | Endpoint | Auth       | Description                                  |
| -------- | ---------- | ------------| -----------------------------------------------|
| `GET`    | `/`          | Public         | Get the current shipping config                 |
| `POST`   | `/`          | `admin` only   | Create the shipping config (only succeeds once) |
| `PATCH`  | `/`          | `admin` only   | Update base fee / per-km fee                    |
| `DELETE` | `/`          | `admin` only   | Delete the shipping config                       |

---

## 🏷️ Categories & Subcategories API

Base URL: `/api/v1/categories`

| Method   | Endpoint                                             | Auth       | Description                     |
| -------- | -------------------------------------------------------| ------------| -----------------------------------|
| `GET`    | `/`                                                       | Public         | List categories, paginated        |
| `POST`   | `/`                                                       | `admin` only   | Create a category                 |
| `GET`    | `/:categorySlug`                                          | Public         | Get a category by slug             |
| `PATCH`  | `/:categoryId`                                            | `admin` only   | Update a category                 |
| `DELETE` | `/:categoryId`                                            | `admin` only   | Delete a category                 |
| `GET`    | `/:categorySlug/subcategory`                              | Public         | List subcategories under a category |
| `POST`   | `/:categoryId/subcategory`                                | `admin` only   | Create a subcategory              |
| `GET`    | `/:categorySlug/subcategory/:subcategorySlug`             | Public         | Get a subcategory by slug          |
| `PATCH`  | `/:categoryId/subcategory/:subcategoryId`                 | `admin` only   | Update a subcategory              |
| `DELETE` | `/:categoryId/subcategory/:subcategoryId`                 | **None currently** | Delete a subcategory (see bug note below) |

> 🔒 **Security note:** unlike every other write route in this project — and unlike the `PATCH` on the exact same route chain — `DELETE /:categoryId/subcategory/:subcategoryId` has no `protectRoute`/`authorizeRoles(["admin"])` applied in `subcategory.routes.ts`. Currently any anonymous client can delete a subcategory. Adding the same two middlewares used on the sibling `PATCH` route closes the gap.

---

## 📦 Products API

Base URL: `/api/v1/products`

| Method   | Endpoint       | Auth       | Description                                          |
| -------- | ---------------- | ------------| --------------------------------------------------------|
| `GET`    | `/`                | Public         | List products — paginated, searchable, filterable         |
| `POST`   | `/`                | `admin` only   | Create a product (multipart, with optional `thumbnail`)   |
| `GET`    | `/:productId`      | Public         | Get a single product                                       |
| `PATCH`  | `/:productId`      | `admin` only   | Update a product (multipart, can replace `thumbnail`)     |
| `DELETE` | `/:productId`      | `admin` only   | Delete a product                                            |

Product creation/updates accept `multipart/form-data` (via `multer`) so a `thumbnail` image file can be uploaded alongside the JSON fields in the same request; the file is streamed to Cloudinary and the resulting URL + `public_id` are stored on the product row.

### Inventory (nested under Products)

| Method  | Endpoint                  | Auth       | Description                             |
| ------- | ---------------------------| ------------| -------------------------------------------|
| `GET`   | `/:productId/inventory`      | Public         | Get current stock level for a product     |
| `PUT`   | `/:productId/inventory`      | `admin` only   | Add stock (increments quantity)            |
| `PATCH` | `/:productId/inventory`      | `admin` only   | Set stock to an exact quantity              |

---

## 🛒 Cart API

Base URL: `/api/v1/cart/items` — **requires authentication.**

| Method   | Endpoint       | Description                          |
| -------- | ---------------- | ---------------------------------------|
| `GET`    | `/`                | List items in your cart, with product details |
| `POST`   | `/`                | Add a product to your cart              |
| `GET`    | `/:productId`      | Get a single cart item                   |
| `PATCH`  | `/:productId`      | Update a cart item's quantity            |
| `DELETE` | `/:productId`      | Remove an item from your cart            |

---

## 📑 Orders & Checkout API

Base URL: `/api/v1/orders` — **requires authentication.**

| Method | Endpoint        | Description                                                       |
| ------ | ------------------| ---------------------------------------------------------------------|
| `GET`  | `/`                  | List your orders, paginated & filterable                              |
| `POST` | `/checkout`          | Convert your cart into an order (`address_id`) — see checkout flow above |
| `GET`  | `/:orderId`           | Get a single order with its line items                                |

> 💡 **Feature gap:** `order.service.ts` has a fully working `cancelOrder(userId, orderId)` function — it validates the order is still `pending`, restores inventory for every line item, and marks the order cancelled, all inside a transaction. It's used internally when a payment fails, but there's currently no `orderController`/route exposing it directly to users (e.g. `POST /:orderId/cancel`) for voluntarily cancelling a still-pending, unpaid order. Worth adding — the hard part (the service logic) is already done.

### Checkout flow (for reference)

1. Locks the user's cart and decrements inventory per item inside a transaction — insufficient stock on any item rolls back the entire checkout (`409 Insufficient stock for <product>`)
2. Geocoded user address + store address → straight-line distance in meters
3. `tax = subtotal × 12%`, `shipping = base_fee + ceil(distance_km) × per_km_fee`, `total = subtotal + tax + shipping`
4. Order + order items created, cart cleared, all committed together

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/v1/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{"address_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

---

## 💳 Payments API

Base URL: `/api/v1/` — **requires authentication.**

| Method | Endpoint                         | Description                                         |
| ------ | ------------------------------------| --------------------------------------------------------|
| `POST` | `/orders/:orderId/payments`           | Pay a pending order via the mock payment provider        |
| `GET`  | `/orders/:orderId/payments`           | Get the payment record for an order                      |
| `GET`  | `/payments/:paymentId`                | Get a single payment by ID                                |

On failed payment, the associated order is automatically cancelled and its inventory restored, via the same `cancelOrder` logic described above.

> 🧪 **Development-only hook:** `payOrder` accepts an optional `shouldFail` boolean in the request body, used to deterministically simulate a payment failure for testing (`payment.controller.ts` reads `req.body?.shouldFail`). This is genuinely useful for local testing against the mock payment provider, but if this project ever moves to a real payment gateway, this client-controlled failure switch should be removed rather than carried forward — a real integration shouldn't let the caller decide whether their own payment succeeds.

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/v1/orders/<orderId>/payments
```

---

## 📦 Response Format

```jsonc
// Success
{
  "success": true,
  "message": "Order created",   // present on most mutating actions
  "data": { /* ... */ }
}

// Error
{
  "success": false,
  "message": "Insufficient stock for Wireless Mouse"
}
```

---

## 💾 Data Model (highlights)

12 tables in total — `users`, `addresses`, `stores`, `shipping`, `categories`, `subcategories`, `products`, `inventory`, `carts`, `cart_items`, `orders`, `order_items`, `payments`. Full DDL lives in `src/database/init.ts`; a few design choices worth calling out:

```sql
-- Single-row tables, enforced at the DB level rather than in application code:
CREATE UNIQUE INDEX IF NOT EXISTS one_store_only ON stores ((true));
CREATE UNIQUE INDEX IF NOT EXISTS one_shipping_only ON shipping ((true));

-- Deliberate, differentiated ON DELETE behavior per relationship:
--   products.subcategory_id  → SET NULL  (a product survives its subcategory being deleted)
--   order_items.product_id   → SET NULL  (historical orders keep product_name/thumbnail even if the product is later deleted)
--   payments.order_id        → RESTRICT  (an order with a payment record can't be deleted outright)
--   everything user-scoped   → CASCADE   (deleting a user cleans up their addresses/cart/orders)

-- Money and quantities are validated at the database layer too, not just in Zod:
CREATE TABLE products (
  ...
  price_cents int NOT NULL CHECK (price_cents >= 0),
  weight_grams int NOT NULL CHECK (weight_grams >= 0),
  ...
);
```

This is the first project in the series where `ON DELETE` behavior is chosen **deliberately and differently per relationship** rather than uniformly cascading or uniformly left as the default — a good pattern to carry into future projects. All monetary values are stored as integer cents (`*_cents` columns) rather than floats, avoiding floating-point rounding issues entirely.

---

## 📮 API Documentation

A Postman collection covering all nine resource groups is committed at `docs/E-COMM-BACKEND.postman_collection`, with every request correctly filled in.

### Endpoint Overview (per the Postman collection)

| Folder         | Request              | Method   | Endpoint                                     |
| --------------- | ------------------------| ---------- | ------------------------------------------------|
| Auth             | Get Current User          | `GET`      | `/api/v1/auth/me`                                |
| Auth             | Register                   | `POST`     | `/api/v1/auth/register`                          |
| Auth             | Login                       | `POST`     | `/api/v1/auth/login`                             |
| Auth             | Logout                      | `POST`     | `/api/v1/auth/logout`                            |
| Auth             | Refresh Access Token         | `POST`     | `/api/v1/auth/refresh`                           |
| Address          | Get                          | `GET`      | `/api/v1/addresses`                              |
| Address          | Get by ID                    | `GET`      | `/api/v1/addresses/:addressId`                   |
| Address          | Create                       | `POST`     | `/api/v1/addresses`                              |
| Address          | Update                       | `PATCH`    | `/api/v1/addresses/:addressId`                   |
| Address          | Delete                       | `DELETE`   | `/api/v1/addresses/:addressId`                   |
| Address          | Set to Default               | `PATCH`    | `/api/v1/addresses/:addressId/default`           |
| Store            | Get / Create / Update / Delete | `GET`/`POST`/`PATCH`/`DELETE` | `/api/v1/store` |
| Shipping         | Get / Create / Update / Delete | `GET`/`POST`/`PATCH`/`DELETE` | `/api/v1/shipping` |
| Categories       | Get / Get by Slug / Create / Update / Delete | — | `/api/v1/categories[...]` |
| Subcategories    | Get / Get by Slug / Create / Update / Delete | — | `/api/v1/categories/:categorySlug/subcategory[...]` |
| Products         | Get / Get by ID / Create / Update / Delete | — | `/api/v1/products[...]` |
| Inventory        | Get by ID / Add Stock / Update Stock | `GET`/`PUT`/`PATCH` | `/api/v1/products/:productId/inventory` |
| Cart Item        | Get / Add / Update / Remove / Get by ID | — | `/api/v1/cart/items[...]` |
| Orders           | Get / Get by ID / Checkout | `GET`/`GET`/`POST` | `/api/v1/orders[...]` |
| Payments         | Pay / Get by Order ID / Get by ID | `POST`/`GET`/`GET` | `/api/v1/orders/:orderId/payments`, `/api/v1/payments/:paymentId` |

---

## 🛠️ Scripts

| Script          | Command                    | Description                             |
| ---------------- | ---------------------------- | -------------------------------------------|
| `npm run dev`     | `tsx watch src/server.ts`    | Run the dev server with hot reload         |
| `npm run build`   | `tsc`                        | Compile TypeScript to `dist/`              |
| `npm start`       | `node dist/server.js`        | Run the compiled production server         |
| `npm run seed:db` | `tsx seed/index.ts`          | Populate the database with sample data      |

---

## 🗺️ Roadmap / Ideas

- [ ] Wire up `orderService.cancelOrder` to a real endpoint (e.g. `POST /orders/:orderId/cancel`) so users can voluntarily cancel a pending order, not just have it happen automatically on payment failure
- [ ] Remove (or environment-gate) the client-controlled `shouldFail` payment testing hook before any real payment provider integration
- [ ] Add automated tests — the checkout transaction (stock decrement + rollback-on-insufficient-stock) and the payment-failure-cancels-order flow are exactly the kind of multi-step logic that benefits most from integration test coverage
- [ ] Add rate limiting on `/auth/login` and `/auth/register`
- [ ] Add refresh-token rotation/revocation, consistent with the rest of the series' roadmap items
- [ ] Consider soft-deleting products (`is_active = false` already exists for this) instead of hard-deleting, to preserve order history integrity beyond what `order_items`' denormalized `product_name`/`product_thumbnail_url` already provides
- [ ] Add an order status transition guard (e.g. a small state machine) now that `orders.status` has grown to include `pending`/`paid`/`processed`/`shipped`/`delivered`/`cancelled` — right now nothing stops an out-of-order transition from being written directly

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR or issue.

## 📄 License

ISC (see `package.json`) — update as appropriate for your project.
