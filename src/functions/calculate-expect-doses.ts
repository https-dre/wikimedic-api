import { addHours, addDays, isBefore } from "date-fns";
import { Treatment } from "@/types/appointment";

function advance(cursor: Date, t: Treatment) {
  if (t.repetition_unit === "HOUR") {
    return addHours(cursor, t.repetition);
  }
  if (t.repetition_unit === "DAY") {
    return addDays(cursor, t.repetition);
  }
  if (t.repetition_unit === "WEEK") {
    return addDays(cursor, t.repetition * 7);
  }
  throw new Error(`Invalid repetition unit: ${t.repetition_unit}`);
}

export function calculateExpectedDoses(
  t: Treatment,
  windowStart: Date,
  windowEnd: Date
): number {

  // Segurança: evita loops infinitos
  if (t.repetition <= 0) return 0;

  let cursor = new Date(t.start_time);

  // End time real da janela
  const end = t.end_time
    ? new Date(Math.min(t.end_time.getTime(), windowEnd.getTime()))
    : windowEnd;

  let count = 0;

  //
  // 1. Avança até entrar na janela do mês
  // (usando SOMENTE date-fns, sem milissegundos → evita bugs de DST)
  //
  while (isBefore(cursor, windowStart)) {
    cursor = advance(cursor, t);

    // Caso o avanço seja grande demais e passe TOTALMENTE do mês
    if (isBefore(end, cursor)) return 0;
  }

  //
  // 2. Conta todas as doses dentro da janela
  //
  while (!isBefore(end, cursor)) {
    if (cursor >= windowStart && cursor <= windowEnd) {
      count++;
    }
    cursor = advance(cursor, t);
  }
  return count;
}