import { z } from "zod";

export const zMedicinePhoto = z.object({
  id: z.string(),
  url: z.string().url(),
  medicine_id: z.string().uuid(),
  created_at: z.coerce.date(),
});

export type MedicinePhoto = z.infer<typeof zMedicinePhoto>;