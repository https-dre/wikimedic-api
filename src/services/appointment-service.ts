import { endOfMonth, startOfMonth } from "date-fns";
import { BadResponse } from "../error-handler";
import { Appointment, DoseRecord } from "../models/Appointment";
import {
  IAppointmentRepository,
  IDoseRecordRepository,
  IMedRepository,
  IUserRepository,
} from "../repositories";
import { calculateExpectedDoses } from "@/functions/calculate-expect-doses";
import { TreatmentSummary_Item } from "@/types/appointment";

export class AppointmentService {
  constructor(
    private medicineRepository: IMedRepository,
    private appointmentRepository: IAppointmentRepository,
    private userRepository: IUserRepository,
    private doseRepository: IDoseRecordRepository
  ) {}

  public async save(data: Omit<Appointment, "id">) {
    const [medicine, user] = await Promise.all([
      this.medicineRepository.findById(data.medicine_id),
      this.userRepository.findById(data.user_id),
    ]);
    if (!medicine) {
      throw new BadResponse("Medicamento não registrado.", 404);
    }
    if (!user) {
      throw new BadResponse("Usuário não encontrado.", 404);
    }

    const created = await this.appointmentRepository.save(data);
    return created;
  }

  public async deleteWithId(id: string) {
    if (!(await this.appointmentRepository.findById(id)))
      throw new BadResponse("Agendamento não registrado.", 404);

    await this.appointmentRepository.deleteById(id);
  }

  public async listWithUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    if (!(await this.userRepository.findById(userId)))
      throw new BadResponse("Usuário não encontrado.", 404);

    const appointments = await this.appointmentRepository.findByUserId(
      userId,
      page,
      pageSize
    );
    return appointments;
  }

  public async getWithDateFilter(userId: string, filter: Date) {
    if (!(await this.userRepository.findById(userId)))
      throw new BadResponse("Usuário não encontrado.", 404);

    const appointments = await this.appointmentRepository.findWithDateFilter(
      userId,
      filter
    );
    return appointments;
  }

  public async pushDoseRecord(data: Omit<DoseRecord, "id">) {
    if (!(await this.appointmentRepository.findById(data.appointment_id)))
      throw new BadResponse("Agendamento não encontrado.", 404);

    const created = await this.doseRepository.save(data);
    return created;
  }

  public async getTreatmentSummary(
    user_id: string,
    month: number,
    year: number
  ): Promise<TreatmentSummary_Item[]> {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));

    if (!(await this.userRepository.findById(user_id)))
      throw new BadResponse("Usuário não encontrado");

    const treatments = await this.appointmentRepository.getTreatmentsByUserId(
      user_id,
      month,
      year
    );

    const summary: TreatmentSummary_Item[] = treatments.map((t) => {
      const expectedCount = calculateExpectedDoses(t, monthStart, monthEnd);
      const progress =
        expectedCount === 0
          ? 0
          : Math.round((t.taken_count / expectedCount) * 100);

      return {
        id: t.id,
        medicine_name: t.commercial_name,
        dosage: `${t.amount} ${t.dosage_unit}`, // Ex: "30 mg" ou "1 Comprimido"
        color: t.color,
        stats: {
          taken: t.taken_count,
          total: expectedCount,
          percentage: progress,
        },
      };
    });

    return summary;
  }
}
