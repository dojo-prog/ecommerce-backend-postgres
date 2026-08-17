import {
  USER_PRIVATE_PROJECTION,
  USER_PUBLIC_PROJECTION,
} from "../database/queries/users";
import pool from "../database/db";
import { RegisterPayload } from "../schemas/auth";
import { UserPrivate, UserPublic } from "../schemas/users";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const findById = async (userId: string): Promise<UserPublic> => {
  const result = await pool.query(
    `
    SELECT ${USER_PUBLIC_PROJECTION}
    FROM users
    WHERE id = $1
    `,
    [userId],
  );

  return result.rows[0];
};

export const findByEmail = async (email: string): Promise<UserPublic> => {
  const result = await pool.query(
    `
    SELECT ${USER_PUBLIC_PROJECTION}
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0];
};

export const findByUsername = async (username: string): Promise<UserPublic> => {
  const result = await pool.query(
    `
    SELECT ${USER_PUBLIC_PROJECTION}
    FROM users
    WHERE username = $1
    `,
    [username],
  );

  return result.rows[0];
};

export const findPrivateByEmail = async (
  email: string,
): Promise<UserPrivate> => {
  const result = await pool.query(
    `
    SELECT ${USER_PRIVATE_PROJECTION}
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0];
};

export const register = async (
  payload: Partial<RegisterPayload> & { password_hash: string },
): Promise<UserPublic> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(payload);

  const result = await pool.query(
    `
    INSERT INTO users (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING ${USER_PUBLIC_PROJECTION};
    `,
    values,
  );

  return result.rows[0];
};
