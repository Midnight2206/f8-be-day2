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
export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Old password is required")
      .max(128),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password does not match new password",
    path: ["confirmPassword"],
  });