import { zAppointment } from "@/models/Appointment";
import { AppointmentService } from "@/services/appointment-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const listAppointmentsByUserId = (
  service: AppointmentService,
): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/users/:userId/appointments",
      {
        schema: {
          summary: "Get user appointments",
          tags: ["appointments", "users"],
          params: z.object({
            userId: z.string().uuid(),
          }),
          querystring: z.object({
            page: z.coerce.number().optional().default(1),
            pageSize: z.coerce.number().optional().default(10),
          }),
          response: {
            200: z.object({
              page: z.number().optional(),
              pageSize: z.number().optional(),
              count: z.number().optional(),
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
          pageSize,
        );
        return reply
          .status(200)
          .send({ page, pageSize, appointments, count: appointments.length });
      },
    );
  };
};
