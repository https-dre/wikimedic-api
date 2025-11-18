import { Medicamento, MedicineImage } from "../../models/Medicamento";

export interface IMedRepository {
  findByNumRegistro(registro: string): Promise<Medicamento | null>;
  save(med: Omit<Medicamento, "id">): Promise<Medicamento>;
  update(update: Partial<Omit<Medicamento, "id">>, id: string): Promise<void>;
  findById(id: string): Promise<Medicamento | null>;
  getAll(): Promise<Medicamento[]>;
  delete(Id: string): Promise<void>;
  filter(category: string, value: string, page:
    number, limit: number): Promise<Medicamento[]>;
  insertImage(id: string, image: MedicineImage): Promise<void>;
}