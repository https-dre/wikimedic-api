import { randomUUID } from "node:crypto";
import { Appointment, DoseRecord, DoseRecord_Join } from "@/models/Appointment";
import { IAppointmentRepository } from "../defs/appointment";
import postgres from "postgres";
import { Treatment } from "@/lib/types/appointment";
import { endOfMonth, startOfMonth } from "date-fns";

export class AppointmentRepository implements IAppointmentRepository {
  constructor(private sql: postgres.Sql) {}

  public async save(data: Omit<Appointment, "id">): Promise<Appointment> {
    const toBeSaved = {
      ...data,
      id: randomUUID(),
    };
    const result: Appointment[] = await this
      .sql`INSERT INTO appointments ${this.sql(toBeSaved)} RETURNING *`;
    return result[0];
  }

  public async findById(id: string): Promise<Appointment> {
    const [result]: Appointment[] = await this
      .sql`SELECT * FROM appointments WHERE id = ${id}`;
    return result;
  }

  public async findByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<Appointment[]> {
    const result: Appointment[] = await this
      .sql`SELECT * FROM appointments WHERE user_id = ${userId}
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    return result;
  }

  public async deleteById(id: string): Promise<void> {
    await this.sql`DELETE FROM appointments WHERE id = ${id}`;
  }

  public async updateWithId(
    id: string,
    fields: Partial<Omit<Appointment, "id">>
  ): Promise<void> {
    await this.sql`UPDATE appointments SET ${this.sql(
      fields
    )} WHERE id = ${id}`;
  }

  public async findWithDateFilter(
    userId: string,
    filter: Date
  ): Promise<Appointment[]> {
    // 1. Define o intervalo do dia que queremos checar (00:00 até 23:59)
    const startOfDay = new Date(filter);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(filter);
    endOfDay.setHours(23, 59, 59, 999);

    /* LÓGICA:
       Para um agendamento estar ativo "Hoje", ele tem que cumprir duas regras:
       1. Ele deve ter começado ANTES (ou durante) o fim de hoje.
       2. Ele deve terminar DEPOIS (ou durante) o início de hoje.
    */

    const result = await this.sql<Appointment[]>`
      SELECT 
        a.*, 
        m.name AS medicine_name
      FROM appointments a
      LEFT JOIN medicines m ON a.medicine_id = m.id
      WHERE a.userId = ${userId}
        -- Começa antes do dia acabar
        AND a.start_time <= ${endOfDay} 
        -- E termina depois do dia começar (ou seja, ainda está valendo hoje)
        AND a.end_time >= ${startOfDay}
    `;

    return result;
  }

  public async getTreatmentsByUserId(
    user_id: string,
    month: number,
    year: number
  ): Promise<Treatment[]> {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(new Date(year, month - 1));

    const treatments = await this.sql<Treatment[]>`
        SELECT 
            a.id AS appointment_id,
            a.start_time,
            a.end_time,
            a.repetition,
            a.repeat_unit,
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
            a.user_id = ${user_id}
            AND a.start_time <= ${monthEnd} 
            AND (a.end_time IS NULL OR a.end_time >= ${monthStart})
        GROUP BY 
            a.id, m.id
      `;
    return treatments;
  }

  public async getRecordsByUser_Id(
    user_id: string,
    month: number,
    year: number
  ): Promise<DoseRecord_Join[]> {
    const records = await this.sql<
      DoseRecord_Join[]
    >`
      SELECT d.*,
      m.commercial_name AS medicine_name,
      a.color AS color,
      a.amount AS amount,
      a.dosage_unit AS dosage_unit
      FROM dose_records d
      LEFT JOIN appointments a ON d.appointment_id = a.id
      LEFT JOIN medicines m ON a.medicine_id = m.id
      WHERE a.user_id = ${user_id}
      AND EXTRACT(MONTH FROM taken_at) = ${month}
      AND EXTRACT(YEAR FROM taken_at) = ${year}
      ORDER BY taken_at DESC
    `;
    return records;
  }
}
