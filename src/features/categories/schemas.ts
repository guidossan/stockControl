import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().max(160).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
