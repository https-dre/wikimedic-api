import { zDoseRecord } from "@/models/Appointment";
import { AppointmentService } from "@/services/appointment-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const createDoseRecord = (
  service: AppointmentService
): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/appointments/records",
      {
        schema: {
          summary: "Create dose record",
          tags: ["appointments"],
          body: z.object({
            record: zDoseRecord.omit({ id: true }),
          }),
          response: {
            201: z.object({
              record: zDoseRecord,
            }),
          },
        },
      },
      async (req, reply) => {
        const { record } = req.body;
        const created = await service.pushDoseRecord(record);
        return reply.status(201).send({ record: created });
      }
    );
  };
};
