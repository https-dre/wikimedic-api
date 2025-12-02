import postgres from "postgres";
import { IMedRepository } from "../defs/medicine";
import { Medicine, MedicineWithoutLeaflet } from "@/models/Medicine";
import { randomUUID } from "node:crypto";

export class MedicineRepository implements IMedRepository {
  constructor(private sql: postgres.Sql) {}

  public async save(
    med: Omit<Medicine, "id" | "created_at">
  ): Promise<Medicine> {
    const toBeSaved = {
      ...med,
      id: randomUUID(),
    };

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
    const medicines = await this.sql<MedicineWithoutLeaflet[]>`
      SELECT 
        m.id, 
        m.commercial_name, 
        m.registry_code, 
        m.created_at,
        m.description, 
        COALESCE(
          JSON_AGG(c.name) FILTER (WHERE c.name IS NOT NULL), 
          '[]'
        ) AS categories,
        mi.url AS image
      FROM medicines m
      LEFT JOIN LATERAL (
        SELECT url FROM medicine_images img
        WHERE img.medicine_id = m.id
        ORDER BY img.created_at ASC
      ) mi ON TRUE
      LEFT JOIN medicine_category mc ON m.id = mc.medicine_id
      LEFT JOIN categories c ON mc.category_id = c.id
      GROUP BY m.id, mi.url
      ORDER BY m.created_at DESC 
      LIMIT ${pageSize} 
      OFFSET ${(page - 1) * pageSize}
    `;

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

  public async searchByName(name: string): Promise<MedicineWithoutLeaflet[]> {
    const medicines = await this.sql<MedicineWithoutLeaflet[]>`
      SELECT 
        m.id, 
        m.commercial_name, 
        m.registry_code, 
        m.created_at,
        m.description, 
        COALESCE(
          JSON_AGG(c.name) FILTER (WHERE c.name IS NOT NULL), 
          '[]'
        ) AS categories,
        mi.url AS image
      FROM medicines m
      LEFT JOIN LATERAL (
        SELECT url FROM medicine_images img
        WHERE img.medicine_id = m.id
        ORDER BY img.created_at ASC
      ) mi ON TRUE
      LEFT JOIN medicine_category mc ON m.id = mc.medicine_id
      LEFT JOIN categories c ON mc.category_id = c.id
      WHERE LOWER(m.commercial_name) LIKE LOWER('%' || ${name} || '%')
      GROUP BY m.id, mi.url
    `;
    return medicines;
  }
}
