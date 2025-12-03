import { MedicinePhoto } from "@/lib/types/medicine";
import { Medicine, MedicineWithoutLeaflet } from "@/models/Medicine";

export interface IMedRepository {
  findByRegistryCode(registro: string): Promise<Medicine | null>;
  save(med: Omit<Medicine, "id" | "created_at">): Promise<Medicine>;
  update(update: Partial<Omit<Medicine, "id">>, id: string): Promise<void>;
  findById(id: string): Promise<Medicine | null>;
  delete(Id: string): Promise<void>;
  listWithPagination(
    page?: number,
    pageSize?: number
  ): Promise<MedicineWithoutLeaflet[]>;
  searchByName(name: string): Promise<MedicineWithoutLeaflet[]>;
  createMedicinePhoto(data: MedicinePhoto): Promise<MedicinePhoto>;
  deleteMedicinePhoto(id: string): Promise<void>;
  listMedicinePhotos(medicine_id: string): Promise<MedicinePhoto[]>;
  findMedicinePhoto(id: string): Promise<MedicinePhoto>;
}
