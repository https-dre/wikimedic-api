import { zSqlMedicine } from "@/models/Medicamento";
import { MedicService } from "@/services/medic-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const getMedicineById = (service: MedicService): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/medicines/:medId",
      {
        schema: {
          summary: "Get medicine with id",
          tags: ["medicines"],
          params: z.object({
            medId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              medicine: zSqlMedicine,
            }),
          },
        },
      },
      async (req, reply) => {
        const { medId } = req.params;
        const medicine = await service.getMedicineWithId(medId);
        return reply.status(200).send({ medicine });
      },
    );
  };
};
