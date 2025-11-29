import { z } from "zod";

export const zAppointment = z.object({
  id: z.string().uuid(),
  all_days: z.boolean().default(false),
  start_time: z.date().nullable(),
  end_time: z.date().nullable(),
  repetition: z.coerce.number(),
  color: z.string(),
  user_id: z.string().uuid(),
  medicine_id: z.string().uuid(),
  medicine_name: z.string().optional()
});

export type Appointment = z.infer<typeof zAppointment>;