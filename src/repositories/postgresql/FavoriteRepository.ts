import postgres from "postgres";
import { IFavoriteRepository } from "../defs/favorite";
import { Favorite } from "@/models/Favorite";
import { randomUUID } from "node:crypto";

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private sql: postgres.Sql) {}

  public async save(data: Omit<Favorite, "id">): Promise<Favorite> {
    const toBeSaved = {
      ...data,
      id: randomUUID(),
    };
    const [created]: Favorite[] = await this
      .sql`INSERT INTO favorites ${this.sql(toBeSaved)} RETURNING *`;
    return created;
  }

  public async deleteById(id: string): Promise<void> {
    await this.sql`DELETE FROM favorites WHERE id = ${id}`;
  }

  public async findByUserId(userId: string): Promise<Favorite[]> {
    const favorites: Favorite[] = await this
      .sql`SELECT * FROM favorites WHERE userId = ${userId}`;
    return favorites;
  }
}
