import { z } from "zod";

export const zFavorite = z.object({
  id: z.string().uuid(),
  medicine_id: z.string().uuid(),
  medicineName: z.string().optional(),
  user_id: z.string().uuid()
});

export type Favorite = z.infer<typeof zFavorite>;