import { z } from "zod";
import { IsoDatetimeSchema, UUIDSchema } from "./common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const UsernameSchema = z
  .string()
  .trim()
  .min(1, { message: "Username is required" })
  .max(100, { message: "Username cannot exceed 100 characters" });

export const EmailSchema = z
  .string()
  .email({ message: "Invalid email format" })
  .toLowerCase();

export const PasswordHashSchema = z
  .string()
  .regex(
    /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/,
    "Invalid bcrypt password hash",
  );

// =======================================
// ENUM SCHEMA
// =======================================

export const UserRoleSchema = z.enum(["customer", "admin"], {
  message: "Invalid user role",
});

// =======================================
// DATABASE ENTITY SCHEMA
// =======================================

export const UserPrivateSchema = z.object({
  id: UUIDSchema,
  username: UsernameSchema,
  email: EmailSchema,
  role: UserRoleSchema,
  password_hash: PasswordHashSchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

export const UserPublicSchema = UserPrivateSchema.omit({ password_hash: true });

// =======================================
// TYPES
// =======================================

export type UserRole = z.infer<typeof UserRoleSchema>;

export type UserPrivate = z.infer<typeof UserPrivateSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
