import { S3Provider } from "./s3-provider"; // Importe seu S3Provider
import { IMedRepository } from "@/lib/repositories";
import { randomUUID } from "node:crypto"; // Para gerar o ID local, caso o DB não gere
import { MedicinePhoto } from "../types/medicine";

export class MedicineMediaProvider {
  constructor(
    private s3Provider: S3Provider,
    private medicineRepository: IMedRepository
  ) {}

  /**
   * Faz o upload da foto para o S3 e registra a referência no banco de dados.
   *
   * @param medicineId O ID do medicamento ao qual a foto pertence.
   * @param fileContent O conteúdo binário da foto (Buffer).
   * @param fileType O tipo de conteúdo da foto (e.g., 'image/jpeg').
   * @returns A entidade MedicinePhoto persistida no banco de dados.
   */
  public async uploadPhoto(
    medicineId: string,
    fileContent: Buffer,
    fileType: string
  ): Promise<MedicinePhoto> {
    // 1. **Upload para o S3**
    // O S3Provider gerará uma chave única (UUID) para o arquivo
    const uploadedFile = await this.s3Provider.uploadFile(
      fileType,
      fileContent
    );

    if (!uploadedFile) {
      throw new Error("Falha ao fazer upload da foto para o S3.");
    }

    // 2. **Registro no Banco de Dados**
    // Passamos a URL e o ID do medicamento para o repositório.
    // O repositório deve gerar o 'id' e 'created_at' da MedicinePhoto.
    const newPhotoData: MedicinePhoto = {
      id: uploadedFile.Key,
      created_at: new Date(),
      url: uploadedFile.Url,
      medicine_id: medicineId,
    };

    const photoEntity = await this.medicineRepository.createMedicinePhoto(
      newPhotoData
    );

    return photoEntity;
  }

  /**
   * 🗑️ Remove a foto do S3 e a referência do banco de dados.
   *
   * @param photoId O ID da MedicinePhoto no banco de dados.
   * @returns void
   */
  public async deletePhoto(photoId: string): Promise<void> {
    const photoToDelete = await this.medicineRepository.findMedicinePhoto(
      photoId
    );

    if (!photoToDelete) {
      return;
    }

    const s3DeleteResult = await this.s3Provider.deleteFile(photoToDelete.id);

    if (!s3DeleteResult.success) {
      console.error("Erro ao remover arquivo do S3:", s3DeleteResult.err);
      throw new Error("Falha ao remover arquivo de mídia do S3.");
    }

    await this.medicineRepository.deleteMedicinePhoto(photoId);
  }

  public async listPhotos(medicineId: string): Promise<MedicinePhoto[]> {
    return this.medicineRepository.listMedicinePhotos(medicineId);
  }
}
