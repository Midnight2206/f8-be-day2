const TASK_LEVELS = ["low", "normal", "high", "urgent"];
const TASK_COLORS = ["blue", "green", "red"];
import {z} from "zod"
export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be at most 50 characters"),

  level: z
    .enum(TASK_LEVELS)
    .optional()
    .default("normal"),

  color: z
    .enum(TASK_COLORS)
    .optional()
    .default("blue"),
});
export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(50, "Title must be at most 50 characters")
      .optional(),

    level: z
      .enum(TASK_LEVELS)
      .optional(),

    color: z
      .enum(TASK_COLORS)
      .optional(),

    completed: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );
