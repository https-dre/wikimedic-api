import { zSqlMedicine } from "@/models/Medicamento";
import { MedicService } from "@/services/medic-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const listMedicines = (service: MedicService): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/medicines",
      {
        schema: {
          summary: "List medicines",
          tags: ["medicines"],
          querystring: z.object({
            page: z.coerce.number().optional().default(1),
            pageSize: z.coerce.number().optional().default(10),
            category: z.string().optional(),
          }),
          response: {
            200: z.object({
              count: z.number().optional(),
              page: z.number().optional(),
              pageSize: z.number().optional(),
              medicines: z.array(zSqlMedicine.omit({ leaflet_data: true })),
            }),
          },
        },
      },
      async (req, reply) => {
        const { page, pageSize } = req.query;
        const medicines = await service.listMedicinesWithPagination(
          page,
          pageSize,
        );
        return reply
          .status(200)
          .send({ medicines, count: medicines.length, page, pageSize });
      },
    );
  };
};
