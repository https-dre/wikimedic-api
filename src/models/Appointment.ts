import { z } from "zod";

export const zAppointment = z.object({
  id: z.string().uuid(),
  all_days: z.boolean().default(false),
  start_time: z.coerce.date().nullable(),
  end_time: z.coerce.date().nullable(),
  repetition: z.coerce.number(),
  repeat_unit: z.enum(["HOURS", "DAYS", "WEEKS", "MONTHS"]),
  amount: z.coerce.number(),
  dosage_unit: z.string(),
  color: z.string(),
  user_id: z.string().uuid(),
  medicine_id: z.string().uuid(),
  medicine_name: z.string().optional(),
});

export const zDoseRecord = z.object({
  id: z.string().uuid(),
  appointment_id: z.string().uuid(),
  taken_at: z.coerce.date(),
  notes: z.string().optional().nullable(),
});

export type DoseRecord = z.infer<typeof zDoseRecord>;
export type Appointment = z.infer<typeof zAppointment>;
