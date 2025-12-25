
import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string("Title must be a string")
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be at most 50 characters"),
  content: z
  .string()
  .min(5, "Content must be at least 5 characters")
  .max(150, "Content must be at most 150 characters"),
});

export const updatePostSchema = z.object({
  title: z
    .string("Title must be a string")
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be at most 50 characters")
    .optional(),
  content: z
  .string()
  .min(5, "Content must be at least 5 characters")
  .max(150, "Content must be at most 150 characters")
  .optional(),
});
