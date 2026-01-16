import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username is too long"),

  email: z
    .email("Invalid email address")
    .max(255),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Email or username is required")
    .max(255),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128),
});
