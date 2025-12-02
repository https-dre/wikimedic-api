import { randomUUID } from "node:crypto";
import { Appointment } from "@/models/Appointment";
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
      .sql`SELECT * FROM appointments WHERE userId = ${userId}
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
    const startOfDay = new Date(filter).setHours(0, 0, 0, 0);
    const endOfDay = new Date(filter).setHours(23, 59, 59, 999);

    const result: Appointment[] = await this.sql`
      SELECT *
      FROM appointments
      WHERE userId = ${userId}
        AND startTime >= ${startOfDay}
        AND startTime <= ${endOfDay}
    `;

    return result;
  }

  public async getTreatmentsByUserId(
    user_id: string,
    month: number,
    year: number
  ): Promise<Treatment[]> {
    const monthStart = startOfMonth(new Date(year, month-1));
    const monthEnd = endOfMonth(new Date(year, month-1));

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
}
