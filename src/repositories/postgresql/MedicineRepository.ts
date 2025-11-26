import postgres from "postgres";
import { IMedRepository } from "../defs/medicine";
import { Medicine, MedicineWithoutLeaflet } from "@/models/Medicamento";
import { randomUUID } from "node:crypto";

export class MedicineRepository implements IMedRepository {
  constructor(private sql: postgres.Sql) {}

  public async save(med: Omit<Medicine, "id" | "created_at">): Promise<Medicine> {
    const toBeSaved = {
      ...med,
      id: randomUUID()
    }

    const [created]: Medicine[] = await this
      .sql`INSERT INTO medicines ${this.sql(toBeSaved)} RETURNING *`;
    return created;
  }

  public async delete(Id: string): Promise<void> {
    await this.sql`DELETE FROM medicines WHERE id = ${Id}`;
  }

  public async listWithPagination(
    page: number = 1,
    pageSize: number = 10
  ): Promise<MedicineWithoutLeaflet[]> {
    const medicines: MedicineWithoutLeaflet[] = await this
      .sql`SELECT id, commercial_name, registry_code, created_at, description
      FROM medicines LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    return medicines;
  }

  public async update(
    update: Partial<Omit<Medicine, "id">>,
    id: string
  ): Promise<void> {
    await this.sql`UPDATE medicines SET ${this.sql(update)} WHERE id = ${id}`;
  }

  public async findById(id: string): Promise<Medicine | null> {
    const [med]: Medicine[] = await this
      .sql`SELECT * FROM medicines WHERE id = ${id}`;
    return med;
  }

  public async findByRegistryCode(code: string): Promise<Medicine | null> {
    const [med]: Medicine[] = await this
      .sql`SELECT * FROM medicines WHERE registry_code = ${code}`;
    return med;
  }
}
