import bcrypt from "bcryptjs";
import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import mockUsers from "./data";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";

const seedUsers = async () => {
  console.log("\nStarting user seed...");

  console.log("Truncating users table...");
  await truncateTable("users");

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash("testPass", salt);

  for (const u of mockUsers) {
    const payload = {
      ...u,
      password_hash,
    };

    const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

    await pool.query(
      `
      INSERT INTO users (${columnsStr})
      VALUES (${placeholdersStr})
      `,
      values,
    );

    console.log("Inserted user:", u.username);
  }

  console.log(`\nInserted ${mockUsers.length} users successfully\n`);
};

export default seedUsers;
