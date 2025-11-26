import { Medicine, MedicineWithoutLeaflet } from "../models/Medicamento";
import { IMedRepository } from "../repositories/.";
import { BadResponse } from "../error-handler";

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
}
