import { Medicine, MedicineWithoutLeaflet } from "../../models/Medicamento";

export interface IMedRepository {
  findByRegistryCode(registro: string): Promise<Medicine | null>;
  save(med: Omit<Medicine, "id">): Promise<Medicine>;
  update(update: Partial<Omit<Medicine, "id">>, id: string): Promise<void>;
  findById(id: string): Promise<Medicine | null>;
  delete(Id: string): Promise<void>;
  listWithPagination(
    page?: number,
    pageSize?: number
  ): Promise<MedicineWithoutLeaflet[]>;
}
