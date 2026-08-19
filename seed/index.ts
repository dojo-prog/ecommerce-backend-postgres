import pool from "../src/database/db";
import seedCategories from "./categories/seed";
import seedProducts from "./products/seed";
import seedShipping from "./shipping/seed";
import seedStores from "./stores/seed";
import seedSubcategories from "./subcategories/seed";
import seedUsers from "./users/seed";

const startSeed = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await seedUsers(client);
    await seedCategories(client);
    await seedSubcategories(client);
    await seedProducts(client);
    await seedStores(client);
    await seedShipping(client);

    await client.query("COMMIT");
    console.log("\nSeeding complete.\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("An error has occured while seeding", error);
  } finally {
    client.release();
  }
};

startSeed();
