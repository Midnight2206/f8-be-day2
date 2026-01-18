import {z} from "zod"
export const searchUserByEmailQuerySchema = z.object({
  q: z
    .string({
      required_error: "Search query is required",
    })
    .min(1, "Search query cannot be empty")
    .max(100, "Search query is too long"),
});
