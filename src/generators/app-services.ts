import { db } from "../data/postgresql/db";
import { JwtProvider } from "../providers/crypto-provider";
import { AppointmentRepository, DoseRecordRepository, UserSqlRepository } from "../repositories";
import { MedicService } from "../services/medic-service";
import { UserService } from "../services/user-service";
import { AppointmentService } from "../services/appointment-service";
import { MedicineRepository } from "@/repositories/postgresql/MedicineRepository";

const jwtProvider = new JwtProvider();
const userSqlRepository = new UserSqlRepository(db);
const appointmentRepository = new AppointmentRepository(db);
const medicineRepository = new MedicineRepository(db);
const doseRepository = new DoseRecordRepository(db);

const appServices = {
  user: new UserService(userSqlRepository, jwtProvider),
  med: new MedicService(medicineRepository),
  appointment: new AppointmentService(
    medicineRepository,
    appointmentRepository,
    userSqlRepository,
    doseRepository
  ),
};

export { appServices };
