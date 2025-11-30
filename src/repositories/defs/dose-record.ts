import { DoseRecord } from "@/models/Appointment";

export interface IDoseRecord {
  save(data: Omit<DoseRecord, "id">): Promise<DoseRecord>;
  findByAppointmentId(
    appointment_id: string,
    page?: number,
    pageSize?: number
  ): Promise<DoseRecord[]>;
}
