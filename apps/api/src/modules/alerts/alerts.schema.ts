import { z } from "zod";

export const listAlertsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  severity: z
    .enum(["MEDIUM", "HIGH", "CRITICAL"])
    .optional(),

  rule: z.string().min(1).optional(),
});

export const alertParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ListAlertsQuery =
  z.infer<typeof listAlertsQuerySchema>;