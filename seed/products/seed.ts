import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";
import mockProducts from "./data";

const seedProducts = async () => {
  console.log("Starting products seed...");

  console.log("Truncating products table...");
  await truncateTable("products");

  const subCatIdMap: Record<string, string> = {};

  for (const p of mockProducts) {
    const { subcategory_name, ...rest } = p;

    let subcategory_id: string;

    if (subCatIdMap[subcategory_name]) {
      subcategory_id = subCatIdMap[subcategory_name];
    } else {
      const { rows } = await pool.query(
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

    await pool.query(
      `
      INSERT INTO products (${columnsStr})
      VALUES (${placeholdersStr})
      `,
      values,
    );

    console.log("Inserted product:", p.name);
  }

  console.log(`\nInserted ${mockProducts.length} products successfully\n`);
};

export default seedProducts;
