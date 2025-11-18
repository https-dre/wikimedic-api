import { z } from "zod";

export const zAppointment = z.object({
  id: z.string().uuid(),
  allDay: z.boolean().default(false),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  repetition: z.coerce.number(),
  color: z.string(),
  userId: z.string().uuid(),
  medicineId: z.string().uuid()
});

export type Appointment = z.infer<typeof zAppointment>;