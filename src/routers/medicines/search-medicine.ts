import { zSqlMedicine } from "@/models/Medicine";
import { MedicService } from "@/services/medic-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const searchMedicine = (service: MedicService): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().patch(
      "/medicines/search",
      {
        schema: {
          summary: "Search medicines by name",
          tags: ["medicines"],
          body: z.object({
            name: z.string().max(255),
          }),
          response: {
            200: z.object({
              count: z.coerce.number(),
              medicines: z.array(zSqlMedicine.omit({ leaflet_data: true })),
            }),
          },
        },
      },
      async (req, reply) => {
        const { name } = req.body;
        const medicines = await service.searchMedicineByName(name);
        return reply.status(200).send({ medicines, count: medicines.length });
      }
    );
  };
};
