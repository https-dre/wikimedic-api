import { MedicineMediaProvider } from "@/lib/providers/medicine-media-provider";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

interface RouteOptions extends FastifyPluginOptions {
  medicineMediaProvider: MedicineMediaProvider;
}

export const deleteMedicinePhoto = async (
  app: FastifyInstance,
  options: RouteOptions
) => {
  const { medicineMediaProvider } = options;
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/medicines/photos",
    {
      schema: {
        summary: "Delete medicine photo",
        tags: ["medicines"],
        body: z.object({
          key: z.string(),
        }),
      },
    },
    async (req, reply) => {
      const { key } = req.body;
      await medicineMediaProvider.deletePhoto(key);
      return reply.status(204).send();
    }
  );
};
