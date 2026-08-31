import { z } from "zod";

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
