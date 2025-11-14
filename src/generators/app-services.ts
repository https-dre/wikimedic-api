import { db } from "../data/postgresql/db";
import { JwtProvider } from "../providers/crypto-provider";
import { MedicamentoRepository } from "../repositories/mongo/MedicamentoRepository";
import { UserSqlRepository } from "../repositories/postgresql/UserSqlRepository";
import { MedicService } from "../services/medic-service";
import { UserService } from "../services/user-service";

const jwtProvider = new JwtProvider();
const userSqlRepository = new UserSqlRepository(db);

const medReposiroty = new MedicamentoRepository();

const appServices = {
  user: new UserService(userSqlRepository, jwtProvider),
  med: new MedicService(medReposiroty),
};

export { appServices };
