import Jwt from "jsonwebtoken";
import { BadResponse } from "../error-handler";
import { User } from "../models/User";
import { JwtProvider } from "../providers/crypto-provider";
import { IUserRepository } from "../repositories";

export class UserService {
  constructor(private repository: IUserRepository, public jwt: JwtProvider) {}

  async saveUser(data: Omit<User, "id" | "created_at">) {
    if (await this.repository.findByEmail(data.email))
      throw new BadResponse("E-mail já cadastrado.");

    if (data.password.length < 8) {
      throw new BadResponse("A senha deve ter mais de 8 caracteres.");
    }
    const created = await this.repository.save(data);
    return created;
  }

  async deleteUser(id: string) {
    const userWithId = await this.repository.findById(id);
    if (!userWithId) throw new BadResponse("Usuário não encontrado.", 404);
    await this.repository.delete(userWithId.id);
  }

  async updateUserById(id: string, updatedFields: Partial<Omit<User, "id">>) {
    const userWithId = await this.repository.findById(id);
    if (!userWithId) return new BadResponse("Nenhum usuário encontrado.", 404);

    await this.repository.updateById(userWithId.id, updatedFields);
  }

  async genAuth(email: string, inputPassword: string, tokenAge?: "1h") {
    const userWithEmail = await this.repository.findByEmail(email);
    if (!userWithEmail) throw new BadResponse("E-mail não encontrado.", 404);

    if (!(userWithEmail.password == inputPassword))
      throw new BadResponse("Senha ou e-mail incorretos.", 403);

    const token = this.jwt.generateToken({ id: userWithEmail.id, email });
    const { password, ...user } = userWithEmail;
    return { token, user };
  }

  async checkToken(token: string) {
    try {
      const payload = this.jwt.verifyToken(token) as { email: string };
      const userWithEmail = await this.repository.findByEmail(payload.email);
      if (!userWithEmail)
        throw new BadResponse("E-mail não registrado, sessão inválida.", 403);
    } catch (err) {
      if (err instanceof Jwt.TokenExpiredError) {
        throw new BadResponse("Sessão expirou.", 403);
      }
      if (err instanceof Jwt.JsonWebTokenError) {
        throw new BadResponse("Sessão inválida.", 403);
      }
      throw err;
    }
  }

  public async getUserById(userId: string): Promise<Omit<User, "password">> {
    const userWithId = await this.repository.findById(userId);
    if (!userWithId) {
      throw new BadResponse("Usuário não encontrado", 404);
    }
    const { password, ...user } = userWithId;
    return user;
  }
}
