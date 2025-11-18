import { db } from "@/data/postgresql/db";
import { Appointment } from "@/models/Appointment";

export const listAppointments = async () => {
  const rows: Appointment[] = await 
    db`SELECT a.medicineName, users.name
    FROM appointments a
    INNER JOIN users ON users.id = a.userId;`;
  return rows;
};
