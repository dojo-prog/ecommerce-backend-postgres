import ENV from "../config/env";
import pool from "./db";

const checkDbConn = async () => {
  try {
    await pool.query("SELECT 1");
    console.log(`PostgreSQL DB connected:`, ENV.DATABASE_NAME);
  } catch (error) {
    throw Error("Failed to connect to the database", { cause: error });
  }
};

export default checkDbConn;
