import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";
import mockStore from "./data";
import geocodeAddress from "../../src/integrations/nominatim/geocoding";
import { PoolClient } from "pg";

const seedStores = async (client: PoolClient) => {
  console.log("Starting store seed...");

  console.log("Truncating stores table...");
  await truncateTable("stores");

  const { latitude, longitude } = await geocodeAddress(mockStore);

  const payload = {
    ...mockStore,
    latitude,
    longitude,
  };

  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  await client.query(
    `
    INSERT INTO stores (${columnsStr})
    VALUES (${placeholdersStr})
    `,
    values,
  );

  console.log("Inserted store:", mockStore.name);

  console.log("\nInserted store successfully\n");
};

export default seedStores;
