import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { MedicineMediaProvider } from "@/lib/providers/medicine-media-provider";

import { Stream } from "stream";

/**
 * Converte um Stream (como o BusboyFileStream) para um Buffer.
 * @param stream O Stream de leitura do arquivo.
 * @returns Um Promise que resolve para o Buffer completo do arquivo.
 */
function toBufferFromStream(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk as Buffer);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
}

interface UploaderRouteOptions extends FastifyPluginOptions {
  medicineMediaProvider: MedicineMediaProvider;
}

export default async function uploadRoutes(
  fastify: FastifyInstance,
  options: UploaderRouteOptions
) {
  const { medicineMediaProvider } = options;

  fastify.post("/medicines/:medicine_id/photos", async (request, reply) => {
    // O @fastify/multipart transforma o payload em um objeto
    const data = await request.file();
    if (!data) {
      return reply.code(400).send();
    }

    // 1. **Validação e Extração de Dados**
    const { medicine_id } = request.params as { medicine_id: string };

    // Verifique se o arquivo e o ID do medicamento estão presentes
    if (!data.file || !medicine_id) {
      return reply.status(400).send({
        message: "É necessário fornecer um arquivo e um medicine_id.",
      });
    }
    const fileStream = data.file;

    let fileBuffer: Buffer;
    try {
      fileBuffer = await toBufferFromStream(fileStream);
    } catch (conversionError) {
      console.error("Erro ao converter stream para buffer:", conversionError);
      return reply
        .status(500)
        .send({ message: "Falha na leitura do arquivo enviado.", conversionError });
    }

    const fileType = data.mimetype; // e.g., 'image/jpeg'

    try {
      // 3. **Chamada ao Provedor de Mídia**
      const photoEntity = await medicineMediaProvider.uploadPhoto(
        medicine_id,
        fileBuffer,
        fileType
      );

      // 4. **Resposta de Sucesso**
      return reply.status(201).send({
        message: "Foto do medicamento enviada com sucesso.",
        photo: photoEntity,
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      return reply
        .status(500)
        .send({ message: "Falha ao processar o upload da foto." });
    }
  });
}
