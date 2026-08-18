import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import mockSubcategories from "./data";
import generateSlug from "../../src/utils/generateSlug";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";

const seedSubcategories = async () => {
  console.log("Starting subcategories seed...");

  console.log("Truncating subcategories table...");
  await truncateTable("subcategories");

  const categoryIdMap: Record<string, string> = {};

  for (const sc of mockSubcategories) {
    let category_id: string;

    if (categoryIdMap[sc.category_name]) {
      category_id = categoryIdMap[sc.category_name];
    } else {
      const { rows } = await pool.query(
        `
        SELECT id FROM categories 
        WHERE name = $1
        `,
        [sc.category_name],
      );

      category_id = rows[0].id;

      categoryIdMap[sc.category_name] = rows[0].id;
    }

    const { category_name, ...rest } = sc;

    const payload = {
      category_id,
      ...rest,
      slug: generateSlug(sc.name),
    };

    const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

    await pool.query(
      `
      INSERT INTO subcategories (${columnsStr})
      VALUES (${placeholdersStr})
      `,
      values,
    );

    console.log("Inserted subcategory:", sc.name);
  }

  console.log(
    `\nInserted ${mockSubcategories.length} subcategories successfully\n`,
  );
};

export default seedSubcategories;
