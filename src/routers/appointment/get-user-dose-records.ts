import { zDoseRecordJoin } from "@/models/Appointment";
import { AppointmentService } from "@/services/appointment-service";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

interface RouteOptions extends FastifyPluginOptions {
  service: AppointmentService;
}

export const getUserDoseRecords = (
  app: FastifyInstance,
  options: RouteOptions
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/appointments/:user_id/records/:year/:month",
    {
      schema: {
        summary: "Get user dose records",
        description:
          "Use essa rota para pegar todas as doses que o usuário tomou em um mês específico",
        tags: ["appointments"],
        params: z.object({
          user_id: z.string().uuid(),
          year: z.coerce.number().int(),
          month: z.coerce.number().int().max(12).min(1),
        }),
        response: {
          200: z.object({
            records: z.array(zDoseRecordJoin),
          }),
        },
      },
    },
    async (req, reply) => {
      const { user_id, year, month } = req.params;
      const { service } = options;
      const records = await service.getDoseRecordsByUserId(
        user_id,
        year,
        month
      );
      return reply.status(200).send({ records });
    }
  );
};
