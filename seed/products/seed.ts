import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";
import mockProducts from "./data";
import { PoolClient } from "pg";

const seedProducts = async (client: PoolClient) => {
  console.log("Starting products seed...");

  console.log("Truncating products table...");
  await truncateTable("products");
  await truncateTable("inventory");

  const subCatIdMap: Record<string, string> = {};

  for (const p of mockProducts) {
    const { subcategory_name, initial_quantity, ...rest } = p;

    let subcategory_id: string;

    if (subCatIdMap[subcategory_name]) {
      subcategory_id = subCatIdMap[subcategory_name];
    } else {
      const { rows } = await client.query(
        `
        SELECT id FROM subcategories
        WHERE name = $1
        `,
        [subcategory_name],
      );

      const id = rows[0].id;

      subcategory_id = id;

      subCatIdMap[subcategory_name] = id;
    }

    const payload = {
      subcategory_id,
      ...rest,
    };

    const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

    const { rows } = await client.query(
      `
      INSERT INTO products (${columnsStr})
      VALUES (${placeholdersStr})
      RETURNING id
      `,
      values,
    );

    const product_id = rows[0].id;

    await client.query(
      `
      INSERT INTO inventory (product_id, quantity)
      VALUES ($1, $2)
      `,
      [product_id, initial_quantity],
    );

    console.log("Inserted product:", p.name);
  }

  console.log(`\nInserted ${mockProducts.length} products successfully\n`);
};

export default seedProducts;
