import { randomUUID } from "node:crypto";
import { Appointment } from "../../models/Appointment";
import { IAppointmentRepository } from "../defs/appointment";
import postgres from "postgres";

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
}
