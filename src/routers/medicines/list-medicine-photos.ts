import { MedicineMediaProvider } from "@/lib/providers/medicine-media-provider";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

interface RouteOptions extends FastifyPluginOptions {
  medicineMediaProvider: MedicineMediaProvider;
}

export const listMedicinePhotos = async (
  app: FastifyInstance,
  options: RouteOptions
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/medicines/:medicine_id/photos",
    {
      schema: {
        summary: "Get medicine photos",
        tags: ["medicines"],
        params: z.object({
          medicine_id: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { medicine_id } = req.params;
      const photos = await options.medicineMediaProvider.listPhotos(
        medicine_id
      );
      return reply.status(200).send({ photos });
    }
  );
};
