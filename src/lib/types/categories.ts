import z from "zod";

export const zCategory = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string().optional(),
  color_code: z.string().optional().nullable(),
});

export type Category = z.infer<typeof zCategory>;
