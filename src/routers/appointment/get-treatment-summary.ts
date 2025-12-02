import { AppointmentService } from "@/services/appointment-service";
import { zTreatmentSummary_Item } from "@/types/appointment";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const getTreatmentSummary = (
  service: AppointmentService
): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/appointments/summary/:user_id/:month/:year",
      {
        schema: {
          summary: "Get treatment summary",
          tags: ["appointments"],
          params: z.object({
            user_id: z.string().uuid(),
            month: z.coerce.number(),
            year: z.coerce.number(),
          }),
          response: {
            200: z.object({
              summary_items: z.array(zTreatmentSummary_Item),
            }),
          },
        },
      },
      async (req, reply) => {
        const { user_id, month, year } = req.params;
        const summary = await service.getTreatmentSummary(user_id, month, year);
        return reply.status(200).send({ summary_items: summary });
      }
    );
  };
};
