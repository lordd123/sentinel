import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum([
    "ADMIN",
    "ANALYST",
    "VIEWER",
  ]),
});

export const userParamsSchema = z.object({
  id: z.string().uuid(),
});

export type UpdateUserRoleInput =
  z.infer<typeof updateUserRoleSchema>;