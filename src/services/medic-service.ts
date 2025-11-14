import { randomUUID } from "crypto";
import { Medicamento, zMedicine } from "../models/Medicamento";
import { IMedRepository } from "../repositories/.";
import { BadResponse } from "../error-handler";
import { mongo } from "../data/mongoDB/conn";
import { MultipartFile } from "@fastify/multipart";

export class MedicService {
  constructor(
    private repository: IMedRepository,
  ) {}

  async save(data: Omit<Medicamento, "id">) {
    const medToSave: Medicamento = {
      id: randomUUID(),
      ...data,
    };

    const saved_med = await this.repository.save(medToSave);
    return saved_med;
  }

  async findById(id: string) {
    const medic = await this.repository.findById(id);

    if (!medic) {
      throw new BadResponse("Medicamento não encontrado", 404);
    }

    return medic;
  }

  async searchByName(name: string) {
    const medicametos = await this.repository.filter("name", name, 1, 10);

    if (medicametos?.length === 0) {
      throw new BadResponse("Nenhum medicamento foi encontrado", 404);
    }

    return medicametos;
  }

  async filterByScope(
    scope: string,
    value: string,
    page: number = 1,
    limit: number = 10
  ) {
    if (!(scope in zMedicine.shape)) {
      throw new BadResponse("Medicamento não possui este campo.");
    }

    const result = await this.repository.filter(scope, value, page, limit);

    if (result.length == 0) {
      throw new BadResponse("Nada encontrado", 404);
    }

    return result;
  }

  async deleteById(id: string) {
    const medFounded = await this.repository.findById(id);
    if (!medFounded) {
      throw new BadResponse("Medicamento não encontrado", 404);
    }

    await this.repository.delete(id);
  }

  async distinct(field: string) {
    if (!(field in zMedicine.shape)) {
      throw new BadResponse(`Medicamento não possui o campo: ${field}`);
    }
    const result = await mongo.db.collection("Medicamento").distinct(field);
    return result;
  }

  async updateMedicine(id: string, update: Partial<Omit<Medicamento, "id">>) {
    const medFounded = await this.repository.findById(id);

    if (!medFounded) {
      throw new BadResponse("Medicamento não encontrado", 404);
    }

    await this.repository.update(update, id);
  }

/*   async uploadMedicineImage(med_id: string, data: MultipartFile) {
    if (!(await this.repository.findById(med_id)))
      throw new BadResponse("Medicamento não encontrado.", 404);

    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(Buffer.from(chunk));
    }

    const content = Buffer.concat(chunks);
    const storageData = await this.storage.uploadFile(
      data.filename,
      content,
      data.mimetype
    );
    await this.repository.insertImage(med_id, {
      key: storageData.filename,
      url: storageData.url,
    });
  } */
}
