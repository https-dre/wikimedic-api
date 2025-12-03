import { zSqlMedicine } from "@/models/Medicine";
import { MedicService } from "@/services/medic-service";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

interface RouteOptions extends FastifyPluginOptions {
  service: MedicService;
}

export const updateMedicieFields = async (
  app: FastifyInstance,
  options: RouteOptions
) => {
  const { service } = options;

  app.withTypeProvider<ZodTypeProvider>().patch(
    "/medicines/:medicine_id",
    {
      schema: {
        summary: "Update medicine without Leaflet",
        tags: ["medicines"],
        params: z.object({
          medicine_id: z.string().uuid(),
        }),
        body: z.object({
          updated_fields: zSqlMedicine.omit({
            id: true,
            created_at: true,
            categories: true,
            image: true,
            leaflet_data: true,
          }).partial(),
        }),
      },
    },
    async (req, reply) => {
      const { medicine_id } = req.params;
      const { updated_fields } = req.body;
      await service.updateMedicineWithoutLeaflet(medicine_id, updated_fields);
      return reply.status(204).send();
    }
  );
};
