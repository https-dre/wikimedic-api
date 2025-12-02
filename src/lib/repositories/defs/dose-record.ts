import { DoseRecord } from "@/models/Appointment";

export interface IDoseRecordRepository {
  save(data: Omit<DoseRecord, "id">): Promise<DoseRecord>;
  findByAppointmentId(
    appointment_id: string,
    page?: number,
    pageSize?: number
  ): Promise<DoseRecord[]>;
  findById(id: string): Promise<DoseRecord>;
}
