import bcrypt from "bcryptjs";
import pool from "../../src/database/db";
import { truncateTable } from "../utils";
import mockUsers from "./data";
import buildInsertQueries from "../../src/utils/query-builder/buildInsertQueries";
import { PoolClient } from "pg";

const seedUsers = async (client: PoolClient) => {
  console.log("\nStarting user seed...");

  console.log("Truncating users table...");
  await truncateTable("users");
  await truncateTable("carts");

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash("testPass", salt);

  for (const u of mockUsers) {
    const payload = {
      ...u,
      password_hash,
    };

    const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

    const { rows } = await client.query(
      `
      INSERT INTO users (${columnsStr})
      VALUES (${placeholdersStr})
      RETURNING id
      `,
      values,
    );

    const user_id = rows[0].id;

    await client.query(
      `
      INSERT INTO carts (user_id)
      VALUES ($1)
      `,
      [user_id],
    );

    console.log("Inserted user:", u.username);
  }

  console.log(`\nInserted ${mockUsers.length} users successfully\n`);
};

export default seedUsers;
