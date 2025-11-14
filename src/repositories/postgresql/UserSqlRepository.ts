import postgres from "postgres";
import { IUserRepository } from "..";
import { User } from "../../models/User";

export class UserSqlRepository implements IUserRepository {
  constructor(private db: postgres.Sql) {}

  public async save(data: Omit<User, "id" | "createdAt">): Promise<void> {
    await this.db`INSERT INTO users (name, email, phone, password) 
      VALUES (${data.name}, ${data.email}, ${data.phone ?? null}, ${data.password})`;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const [user]: User[] = await this
      .db`SELECT * FROM users WHERE email = ${email}`;
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    const [user]: User[] = await this.db`SELECT * FROM users WHERE id = ${id}`;
    return user;
  }

  public async delete(id: string): Promise<void> {
    await this.db`DELETE FROM users WHERE id = ${id}`;
  }

  public async updateById(
    id: string,
    update: Partial<Omit<User, "id">>
  ): Promise<void> {
    const entries = Object.entries(update);

    if (entries.length === 0) return;

    const setClauses = entries
      .map(([key], i) => `${key} = $${i + 1}`)
      .join(", ");

    const values = entries.map(([, value]) =>
      value === undefined ? null : value
    );

    const sqlString = `
    UPDATE users
    SET ${setClauses}
    WHERE id = $${values.length + 1};
  `;

    await this.db.unsafe(sqlString, [...values, id]);
  }
}
