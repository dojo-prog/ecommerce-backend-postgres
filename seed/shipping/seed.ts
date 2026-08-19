import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";
import mockShippingMethod from "./data";

const seedShipping = async () => {
  console.log("Starting shipping seed...");

  console.log("Truncating shipping table...");
  await truncateTable("shipping");

  const { columnsStr, placeholdersStr, values } =
    buildInsertQueries(mockShippingMethod);

  await pool.query(
    `
    INSERT INTO shipping (${columnsStr})
    VALUES (${placeholdersStr})
    `,
    values,
  );

  console.log("Inserted shipping method:", mockShippingMethod.name);

  console.log("\nInserted shipping method successfully\n");
};

export default seedShipping;
