import pool from "../src/database/db";

export const truncateTable = async (tablename: string) => {
  await pool.query(`TRUNCATE TABLE ${tablename} CASCADE`);
};
