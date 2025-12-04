import { addHours, addDays, addWeeks, isBefore, isAfter } from "date-fns";

// Definição dos tipos mínimos que precisamos
type AppointmentData = {
  start_time: Date | string;
  repetition: number;
  repeat_unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | string; // Ajuste conforme seu enum
  last_taken_at?: Date | string | null; // Pode vir nulo se nunca tomou
};

type NextDoseResult = {
  date: Date;
  status: "LATE" | "PENDING";
};

export function calculateNextDose(appt: AppointmentData): NextDoseResult {
  // 1. Definir o Ponto de Partida (Base Date)
  // Se já tomou alguma vez, conta a partir da última dose.
  // Se nunca tomou, conta a partir do horário de início programado.
  const baseDate = appt.last_taken_at
    ? new Date(appt.last_taken_at)
    : new Date(appt.start_time);

  let nextDate = new Date(baseDate);

  // 2. Somar o intervalo (repetition)
  const amount = Number(appt.repetition); // Garantir que é numero

  switch (appt.repeat_unit) {
    case "HOUR":
      nextDate = addHours(baseDate, amount);
      break;
    case "DAY":
      nextDate = addDays(baseDate, amount);
      break;
    case "WEEK":
      nextDate = addWeeks(baseDate, amount);
      break;
    case "MONTH":
      // Adicionar meses no JS nativo é chato, date-fns ajuda muito aqui
      // Se não usar date-fns: nextDate.setMonth(nextDate.getMonth() + amount);
      // Mas cuidado com virada de ano, date-fns lida melhor (addMonths)
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + amount);
      nextDate = d;
      break;
    default:
      console.warn("Unidade desconhecida, mantendo data base");
  }

  // 3. Definir o Status
  const now = new Date();

  // Se a próxima dose calculada já passou (é menor que agora), está ATRASADO.
  const isLate = isBefore(nextDate, now);

  return {
    date: nextDate,
    status: isLate ? "LATE" : "PENDING",
  };
}
