import { Treatment } from "@/types/appointment";
import { addDays, addHours, isBefore } from "date-fns";

function getMillisecondsPerUnit(unit: string): number {
  const hour = 3600 * 1000;
  if (unit === "HOUR") return hour;
  if (unit === "DAY") return hour * 24;
  if (unit === "WEEK") return hour * 24 * 7;
  return 0;
}

export function calculateExpectedDoses(
  treatment: Treatment,
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