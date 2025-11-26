import { FastifyPluginAsync } from "fastify";
import { AppointmentService } from "../../services/appointment-service";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { zAppointment } from "../../models/Appointment";

export const createAppointment = (
  service: AppointmentService
): FastifyPluginAsync => {
  return async (app) => {
    const server = app.withTypeProvider<ZodTypeProvider>();
    server.post(
      "/appointments/",
      {
        schema: {
          summary: "Create appointment",
          tags: ["appointments"],
          body: z.object({
            appointment: zAppointment.omit({ id: true }),
          }),
          response: {
            201: z.object({
              appointment_id: z.string().uuid(),
            }),
          },
        },
      },
      async (req, reply) => {
        const { appointment } = req.body;
        const created = await service.save(appointment);
        return reply.status(201).send({ appointment_id: created.id });
      }
    );
  };
};
