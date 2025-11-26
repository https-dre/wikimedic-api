import { Appointment } from "../../models/Appointment";

export interface IAppointmentRepository {
  save(data: Omit<Appointment, "id">): Promise<Appointment>;
  findById(id: string): Promise<Appointment>;
  findByUserId(userId: string, page?: number, pageSize?: number): Promise<Appointment[]>;
  deleteById(id: string): Promise<void>;
  updateWithId(id: string, fields: Partial<Omit<Appointment, "id">>): Promise<void>;
  findWithDateFilter(userId: string, filter: Date): Promise<Appointment[]>;
}