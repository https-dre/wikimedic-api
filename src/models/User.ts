import { z } from "zod";

export const zUser = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  email: z.string().email(),
  phone: z.string().max(20),
  password: z.string().min(8).max(36),
  created_at: z.coerce.date()
})

export type User = z.infer<typeof zUser>;