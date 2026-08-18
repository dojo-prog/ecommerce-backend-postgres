import { truncateTable } from "../utils";
import generateSlug from "../../src/utils/generateSlug";
import pool from "../../src/database/db";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";
import mockCategories from "./data";

const seedCategories = async () => {
  console.log("Starting categories seed...");

  console.log("Truncating category table...");
  await truncateTable("categories");

  for (const c of mockCategories) {
    const slug = generateSlug(c.name);

    const { columnsStr, placeholdersStr, values } = buildInsertQueries({
      ...c,
      slug,
    });

    await pool.query(
      `
      INSERT INTO categories(${columnsStr})
      VALUES (${placeholdersStr})
      `,
      values,
    );

    console.log("Inserted category:", c.name);
  }

  console.log(`\nInserted ${mockCategories.length} categories successfully\n`);
};

export default seedCategories;
