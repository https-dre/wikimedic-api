import { BadResponse } from "../error-handler";
import { Appointment } from "../models/Appointment";
import {
  IAppointmentRepository,
  IMedRepository,
  IUserRepository,
} from "../repositories";

export class AppointmentService {
  constructor(
    private medicineRepository: IMedRepository,
    private appointmentRepository: IAppointmentRepository,
    private userRepository: IUserRepository
  ) {}

  public async save(data: Omit<Appointment, "id">) {
    if (!(await this.medicineRepository.findById(data.medicineId))) {
      throw new BadResponse("Medicamento não registrado.", 404);
    }
    if (!(await this.appointmentRepository.findById(data.userId))) {
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
}
