import { z } from "zod";

export const zUser = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  password: z.string().min(8).max(36),
  createdAt: z.date()
})

export type User = z.infer<typeof zUser>;