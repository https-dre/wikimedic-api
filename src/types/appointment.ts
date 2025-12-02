import { z } from "zod";

export const zTreatment = z.object({
  appointment_id: z.string().uuid(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  repetition: z.coerce.number(),
  repeat_unit: z.string(),
  amount: z.coerce.number(),
  dosage_unit: z.string(),
  color: z.string(),
  commercial_name: z.string(),
  taken_count: z.coerce.number(),
});

export const zTreatmentSummary_Item = z.object({
  id: z.string().uuid(),
  medicine_name: z.string(),
  dosage: z.string(),
  color: z.string(),
  stats: z.object({
    taken: z.coerce.number(),
    total: z.coerce.number(),
    percentage: z.coerce.number(),
  }),
});

export type Treatment = z.infer<typeof zTreatment>;
export type TreatmentSummary_Item = z.infer<typeof zTreatmentSummary_Item>;
