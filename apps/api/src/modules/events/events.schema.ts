import { z } from "zod";

export const createEventSchema = z.object({
  type: z.string().min(1),
  source: z.string().min(1),

  severity: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),
});

export type CreateEventInput =
  z.infer<typeof createEventSchema>;

  export const listEventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  severity: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional(),

  source: z.string().min(1).optional(),

  type: z.string().min(1).optional(),
});

export type ListEventsQuery =
  z.infer<typeof listEventsQuerySchema>;

  export const eventParamsSchema = z.object({
  id: z.uuid(),
});