import { User } from "@/models/User";

export interface IUserRepository {
  save(data: Omit<User, "id" | "created_at">): Promise<User>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateById(id: string, update: Partial<Omit<User, "id">>): Promise<void>;
}