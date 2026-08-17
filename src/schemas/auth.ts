import { z } from "zod";
import { UUIDSchema } from "./common";
import { UsernameSchema, UserPublicSchema, UserRoleSchema } from "./users";

// =======================================
// REUSABLE FIELDS
// =======================================

export const RegisterEmailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .max(100, { message: "Email cannot exceed 100 characters" })
  .email({ message: "Invalid email format" })
  .toLowerCase();

export const LoginEmailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .max(100, { message: "Email cannot exceed 100 characters" })
  .email({ message: "Invalid email format" })
  .toLowerCase();

export const RegisterPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters");

export const LoginPasswordSchema = z.string().min(1, "Password is required");

export const ConfirmPasswordSchema = z
  .string()
  .min(1, "Confirmation password is required");

// =======================================
// REQ BODY SCHEMA
// =======================================

export const RegisterInputSchema = z
  .object({
    username: UsernameSchema,
    email: RegisterEmailSchema,
    password: RegisterPasswordSchema,
    confirm_password: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords does not match",
    path: ["confirm_password"],
  });

export const LoginInputSchema = z.object({
  email: LoginEmailSchema,
  password: LoginPasswordSchema,
});

// =======================================
// AUTH TOKEN SCHEMA
// =======================================

export const AccessTokenSchema = z.object({
  id: UUIDSchema,
  role: UserRoleSchema,
});

export const RefreshTokenSchema = z.object({
  id: UUIDSchema,
});

// =======================================
// RESULT SCHEMA
// =======================================

const RegisterServiceResultResultSchema = z.object({
  user: UserPublicSchema,
  access_token: z.string(),
  refresh_token: z.string(),
});

const LoginServiceResultResultSchema = z.object({
  user: UserPublicSchema,
  access_token: z.string(),
  refresh_token: z.string(),
});

// =======================================
// TYPES
// =======================================

export type RegisterPayload = z.infer<typeof RegisterInputSchema>;
export type LoginPayload = z.infer<typeof LoginInputSchema>;

export type AccessTokenPayload = z.infer<typeof AccessTokenSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenSchema>;

export type RegisterServiceResult = z.infer<
  typeof RegisterServiceResultResultSchema
>;
export type LoginServiceResult = z.infer<typeof LoginServiceResultResultSchema>;
