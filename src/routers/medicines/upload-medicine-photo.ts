import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { MedicineMediaProvider } from "@/lib/providers/medicine-media-provider";

import { Stream } from "stream";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { toBufferFromStream } from "@/lib/functions/convert-to-buffer";

interface UploaderRouteOptions extends FastifyPluginOptions {
  medicineMediaProvider: MedicineMediaProvider;
}

export async function uploadMedicinePhoto(
  app: FastifyInstance,
  options: UploaderRouteOptions
) {
  const { medicineMediaProvider } = options;

  app.withTypeProvider<ZodTypeProvider>().post(
    "/medicines/:medicine_id/photos",
    {
      schema: {
        summary: "Upload medicine image",
        description:
          "'Content-Type' deve ser 'multipart/form-data', envie a imagem no campo 'file'",
        tags: ["medicines"],
        params: z.object({
          medicine_id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
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
          details: "É necessário fornecer um arquivo e um medicine_id.",
        });
      }
      const fileStream = data.file;

      let fileBuffer: Buffer;
      try {
        fileBuffer = await toBufferFromStream(fileStream);
      } catch (conversionError) {
        console.error("Erro ao converter stream para buffer:", conversionError);
        return reply.status(500).send({
          details: "Falha na leitura do arquivo enviado.",
          error: conversionError,
        });
      }

      const fileType = data.mimetype; // e.g., 'image/jpeg'

      // 3. **Chamada ao Provedor de Mídia**
      const photoEntity = await medicineMediaProvider.uploadPhoto(
        medicine_id,
        fileBuffer,
        fileType
      );

      console.log(photoEntity);

      // 4. **Resposta de Sucesso**
      return reply.status(201).send({
        details: "Foto do medicamento enviada com sucesso."
      });
    }
  );
}
