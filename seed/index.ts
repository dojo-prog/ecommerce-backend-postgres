import pool from "../src/database/db";
import seedCategories from "./categories/seed";
import seedUsers from "./users/seed";

const startSeed = async () => {
  try {
    await pool.query("BEGIN");

    await seedUsers();
    await seedCategories();

    await pool.query("COMMIT");
    console.log("\nSeeding complete.\n");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("An error has occured while seeding", error);
  }
};

startSeed();
