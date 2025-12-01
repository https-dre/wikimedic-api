import { DoseRecord } from "@/models/Appointment";
import { IDoseRecordRepository } from "../defs/dose-record";
import postgres from "postgres";
import { randomUUID } from "node:crypto";

export class DoseRecordRepository implements IDoseRecordRepository {
  constructor(private sql: postgres.Sql) {}

  public async save(data: Omit<DoseRecord, "id">): Promise<DoseRecord> {
    const prepared = {
      ...data,
      id: randomUUID(),
    };
    const [created] = await this.sql<
      DoseRecord[]
    >`INSERT INTO dose_records ${this.sql(prepared)} RETURNING *`;
    return created;
  }

  public async findByAppointmentId(
    appointment_id: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<DoseRecord[]> {
    const records = await this.sql<DoseRecord[]>`SELECT * FROM dose_records 
    WHERE appointment_id = ${appointment_id} 
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;

    return records;
  }

  public async findById(id: string): Promise<DoseRecord> {
    const [record] = await this.sql<
      DoseRecord[]
    >`SELECT * FROM dose_records WHERE id = ${id}`;
    return record;
  }
}
