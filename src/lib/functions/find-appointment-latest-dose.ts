import { db } from "@/infra/sql";
import { calculateNextDose } from "./calculate-next-dose";
import { Appointment } from "@/models/Appointment";

// CORREÇÃO 1: Use '&' (Interseção) para somar os campos, não '|' (Union)
// Isso diz: "É tudo que tem em Appointment MAIS o campo latest_taken_at"
type ApptWithHistory = Appointment & { latest_taken_at: Date | string | null };

export const findAppointmentsWithLatestDose = async (user_id: string) => {
  const appointments = await db<ApptWithHistory[]>`
    SELECT 
      a.*,
      ld.taken_at as latest_taken_at
    FROM appointments a
    LEFT JOIN LATERAL (
      SELECT taken_at
      FROM dose_records d
      WHERE d.appointment_id = a.id
      ORDER BY d.taken_at DESC
      LIMIT 1
    ) ld ON true
     WHERE a.user_id = ${user_id}
     AND (a.end_time IS NULL OR a.end_time > NOW())
  `;

  return appointments.map((appt) => {
    // Se no banco é NOT NULL, podemos forçar ou tratar. 
    // Aqui assumo que se vier null (erro de banco), usamos a data atual como fallback ou lançamos erro.
    if (!appt.start_time) {
        throw new Error(`Agendamento ${appt.id} sem data de início.`);
    }

    const nextDose = calculateNextDose({
      ...appt,
      start_time: appt.start_time, 
      last_taken_at: appt.latest_taken_at, 
    });

    return {
      ...appt,
      next_dose_date: nextDose.date,
      status: nextDose.status,
    };
  });
};