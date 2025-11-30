import { db as sql } from "@/data/postgresql/db";
import {
  startOfMonth,
  endOfMonth,
  differenceInHours,
  differenceInDays,
  addHours,
  addDays,
  isAfter,
  isBefore,
} from "date-fns";

interface MonthlySummaryParams {
  userId: string;
  month: number;
  year: number;
}

function calculateExpectedDoses(
  treatment: any,
  windowStart: Date,
  windowEnd: Date
): number {
  let count = 0;

  // O cálculo começa na data do agendamento ou no início do mês (o que for maior)
  let currentCursor = new Date(treatment.start_time);

  // Se o tratamento começou ANTES desse mês, precisamos projetar a primeira dose DENTRO do mês
  if (isBefore(currentCursor, windowStart)) {
    // Aqui entra uma lógica para "avançar" o cursor até entrar na janela do mês
    // baseada na repetição.
    const msPerUnit =
      getMillisecondsPerUnit(treatment.repetition_unit) * treatment.repetition;
    const diff = windowStart.getTime() - currentCursor.getTime();
    const jumps = Math.ceil(diff / msPerUnit);
    currentCursor = new Date(currentCursor.getTime() + jumps * msPerUnit);
  }

  const actualEnd = treatment.end_time
    ? new Date(Math.min(treatment.end_time.getTime(), windowEnd.getTime()))
    : windowEnd;

  // Loop simulando as doses para contar quantas caem neste mês
  while (
    isBefore(currentCursor, actualEnd) ||
    currentCursor.getTime() === actualEnd.getTime()
  ) {
    if (currentCursor >= windowStart) {
      count++;
    }

    // Avançar o tempo
    if (treatment.repetition_unit === "HOUR") {
      currentCursor = addHours(currentCursor, treatment.repetition);
    } else if (treatment.repetition_unit === "DAY") {
      currentCursor = addDays(currentCursor, treatment.repetition);
    } else if (treatment.repetition_unit === "WEEK") {
      currentCursor = addDays(currentCursor, treatment.repetition * 7);
    } else {
      break; // Segurança
    }
  }

  return count;
}

function getMillisecondsPerUnit(unit: string): number {
  const hour = 3600 * 1000;
  if (unit === "HOUR") return hour;
  if (unit === "DAY") return hour * 24;
  if (unit === "WEEK") return hour * 24 * 7;
  return 0;
}

export async function getMonthlyTreatmentSummary({
  userId,
  month,
  year,
}: MonthlySummaryParams) {
  // 1. Definir janelas de tempo
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  
  const treatments = await sql`
    SELECT 
        a.id AS appointment_id,
        a.start_time,
        a.end_time,
        a.repetition,
        a.repetition_unit,
        a.amount,
        a.dosage_unit,
        a.color,
        m.commercial_name,
        COUNT(dr.id)::int AS taken_count
    FROM 
        appointments a
    JOIN 
        medicines m ON a.medicine_id = m.id
    LEFT JOIN 
        dose_records dr ON dr.appointment_id = a.id 
        AND dr.taken_at >= ${monthStart} 
        AND dr.taken_at <= ${monthEnd}
    WHERE 
        a.user_id = ${userId}
        AND a.start_time <= ${monthEnd} 
        AND (a.end_time IS NULL OR a.end_time >= ${monthStart})
    GROUP BY 
        a.id, m.id
  `;

  // 3. Processar cada tratamento para calcular o "Esperado"
  const summary = treatments.map((t) => {
    const expectedCount = calculateExpectedDoses(t, monthStart, monthEnd);

    // Evitar divisão por zero e garantir que não passe de 100% se o usuário tomou extra
    const progress =
      expectedCount === 0
        ? 0
        : Math.round((t.taken_count / expectedCount) * 100);

    return {
      id: t.appointment_id,
      medicineName: t.commercial_name,
      dosage: `${t.amount} ${t.dosage_unit}`, // Ex: "30 mg" ou "1 Comprimido"
      color: t.color,
      stats: {
        taken: t.taken_count,
        total: expectedCount,
        percentage: progress,
      },
    };
  });

  return summary;
}
