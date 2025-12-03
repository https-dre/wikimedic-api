import { setLeafletUpdate } from "@/lib/functions/update-medicine-leaflet";
import { zLeaflet } from "@/models/Medicine";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const updateMedicineLeaflet = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/medicines/:medicine_id/leaflet",
    {
      schema: {
        summary: "Update medicine leaflet",
        tags: ["medicines", "dev"],
        params: z.object({
          medicine_id: z.string().uuid(),
        }),
        body: z.object({
          updated_fields: zLeaflet.partial(),
        }),
      },
    },
    async (req, reply) => {
      const { medicine_id } = req.params;
      const { updated_fields } = req.body;
      await setLeafletUpdate(medicine_id, updated_fields);
      return reply.status(204).send();
    }
  );
};
