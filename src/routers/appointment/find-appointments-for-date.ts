import { AppointmentService } from "@/services/appointment-service";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

interface RouteOptions extends FastifyPluginOptions {
  service: AppointmentService;
}

export const findAppointmentsWithDateFiler = async (
  app: FastifyInstance,
  options: RouteOptions
) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/appointments/:user_id/date/:date",
    {
      schema: {
        summary: "Get appointments using Date filer",
        tags: ["appointments"],
        params: z.object({
          user_id: z.string().uuid(),
          date: z.coerce.date().describe("A data do dia em ISO String"),
        }),
      },
    },
    async (req, reply) => {
      const { user_id, date } = req.params;
      const appts = await options.service.findWithDateFiler(user_id, date);
      return reply.status(200).send({ appointments: appts });
    }
  );
};
