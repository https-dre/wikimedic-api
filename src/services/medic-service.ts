import { Medicine, MedicineWithoutLeaflet } from "../models/Medicine";
import { IMedRepository } from "@/lib/repositories/.";
import { BadResponse } from "@/lib/errors/error-handler";

type MedicineUpdated = Omit<
  Medicine,
  "id" | "created_at" | "image" | "categories"
>;

export class MedicService {
  constructor(private repository: IMedRepository) {}

  public async getMedicineWithId(id: string): Promise<Medicine> {
    const medicine = await this.repository.findById(id);
    if (!medicine) {
      throw new BadResponse("Medicamento não registrado no sistema.");
    }
    return medicine;
  }

  public async getMedicineWithCode(code: string): Promise<Medicine> {
    const medicine = await this.repository.findByRegistryCode(code);
    if (!medicine)
      throw new BadResponse("Medicamento não registrado no sistema", 404);

    return medicine;
  }

  public async createMedicine(
    data: Omit<Medicine, "id" | "created_at">
  ): Promise<Medicine> {
    const medWithCode = await this.repository.findByRegistryCode(
      data.registry_code
    );
    if (medWithCode) {
      throw new BadResponse(
        "Um medicamento com este número de registro já existe"
      );
    }
    const created = await this.repository.save(data);
    return created;
  }

  public async listMedicinesWithPagination(
    page: number,
    pageSize: number
  ): Promise<MedicineWithoutLeaflet[]> {
    const medicines = await this.repository.listWithPagination(page, pageSize);
    return medicines;
  }

  public async searchMedicineByName(name: string) {
    const medicines = await this.repository.searchByName(name);
    if (medicines.length == 0) {
      throw new BadResponse("Nenhum medicamento encontrado.", 404);
    }

    return medicines;
  }

  public async updateMedicineWithoutLeaflet(
    medicine_id: string,
    fields: Partial<Omit<MedicineUpdated, "leaflet_data">>
  ) {
    const medicine = await this.repository.findById(medicine_id);
    if(!medicine)
      throw new BadResponse("Medicamento não encontrado!");

    await this.repository.update(fields, medicine_id);
  }
}
