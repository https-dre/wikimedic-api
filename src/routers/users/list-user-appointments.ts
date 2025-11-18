import { FastifyPluginAsync } from "fastify";
import { AppointmentService } from "../../services/appointment-service";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { zAppointment } from "../../models/Appointment";

export const listUserAppointments = (
  service: AppointmentService
): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/users/:userId/appointments",
      {
        schema: {
          summary: "List user appointments",
          tags: ["users"],
          params: z.object({
            userId: z.string().uuid(),
          }),
          querystring: z.object({
            page: z.coerce.number().default(1),
            pageSize: z.coerce.number().default(10),
          }),
          response: {
            200: z.object({
              appointments: z.array(zAppointment),
            }),
          },
        },
      },
      async (req, reply) => {
        const { userId } = req.params;
        const { page, pageSize } = req.query;
        const appointments = await service.listWithUserId(
          userId,
          page,
          pageSize
        );
        return reply.status(200).send({ appointments });
      }
    );
  };
};
