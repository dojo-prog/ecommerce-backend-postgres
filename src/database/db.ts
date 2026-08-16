import { Pool } from "pg";
import ENV from "../config/env";

const pool = new Pool({
  host: ENV.DATABASE_HOST,
  port: ENV.DATABASE_PORT,
  database: ENV.DATABASE_NAME,
  user: ENV.DATABASE_USER,
  password: ENV.DATABASE_PASSWORD,
});

export default pool;
