import { FastifyPluginAsync } from "fastify";
import { AppointmentService } from "../../services/appointment-service";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteAppointment = (
  service: AppointmentService
): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().delete(
      "/appointments/:id",
      {
        schema: {
          summary: "Delete appointment",
          tags: ["appointments"],
          params: z.object({
            id: z.string().uuid(),
          }),
        },
      },
      async (req, reply) => {
        const { id } = req.params;
        await service.deleteWithId(id);
        return reply.status(204).send();
      }
    );
  };
};
