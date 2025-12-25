
import { z } from "zod";

export const createCommentSchema = z.object({
  
  content: z
  .string("Content must be a string"),
  author: z
  .string("Author must be a string")
});

export const updateCommentSchema = z.object({
  
  content: z
  .string("Content must be a string")
});
