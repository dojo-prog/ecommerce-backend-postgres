import { z } from "zod";
import { UsernameSchema } from "../users";
import {
  ConfirmPasswordSchema,
  LoginEmailSchema,
  LoginPasswordSchema,
  RegisterEmailSchema,
  RegisterPasswordSchema,
} from "./auth.schema";

// =======================================
// BODY
// =======================================

export const RegisterBodySchema = z
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

export const LoginBodySchema = z.object({
  email: LoginEmailSchema,
  password: LoginPasswordSchema,
});

// =======================================
// TYPES
// =======================================

export type RegisterBody = z.infer<typeof RegisterBodySchema>;

export type LoginBody = z.infer<typeof LoginBodySchema>;
