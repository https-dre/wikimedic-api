import { z } from "zod";

export const zFavorite = z.object({
  id: z.string().uuid(),
  medicineId: z.string().uuid(),
  medicineName: z.string(),
  userId: z.string()
});

export type Favorite = z.infer<typeof zFavorite>;