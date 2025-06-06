import { z } from "zod";

export const MeritQuerySchema = z.object({
  status: z.enum(["complete", "incomplete"]).optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: "Year must be a 4-digit string" })
    .optional()
});

export const ResearcherMeritQuerySchema = MeritQuerySchema;
