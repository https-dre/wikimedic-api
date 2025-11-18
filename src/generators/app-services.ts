import { db } from "../data/postgresql/db";
import { JwtProvider } from "../providers/crypto-provider";
import { MedicamentoRepository } from "../repositories/mongo/MedicamentoRepository";
import { AppointmentRepository, UserSqlRepository } from "../repositories";
import { MedicService } from "../services/medic-service";
import { UserService } from "../services/user-service";
import { AppointmentService } from "../services/appointment-service";

const jwtProvider = new JwtProvider();
const userSqlRepository = new UserSqlRepository(db);
const appointmentRepository = new AppointmentRepository(db);

const medRepository = new MedicamentoRepository();

const appServices = {
  user: new UserService(userSqlRepository, jwtProvider),
  med: new MedicService(medRepository),
  appointment: new AppointmentService(
    medRepository,
    appointmentRepository,
    userSqlRepository
  ),
};

export { appServices };
