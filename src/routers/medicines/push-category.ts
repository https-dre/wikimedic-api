import { db } from "@/data/postgresql/db";
import { Medicine } from "@/models/Medicine";
import { Category } from "@/types/categories";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const pushCategory = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/medicines/:medicine_id/categories",
    {
      schema: {
        summary: "Push medicine category",
        tags: ["medicines", "dev"],
        body: z.object({
          category_id: z.string(),
        }),
        params: z.object({
          medicine_id: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { medicine_id } = req.params;
      const { category_id } = req.body;

      const [medicine] = await db<
        Medicine[]
      >`SELECT * FROM medicines WHERE id = ${medicine_id}`;

      if (!medicine)
        return reply
          .status(404)
          .send({ details: "Medicamento não encontrado" });

      const [category] = await db<
        Category[]
      >`SELECT * FROM categories WHERE id = ${category_id}`;

      if (!category) {
        return reply.status(404).send({ details: "Categoria não encontrada." });
      }

      const [created] = await db`INSERT INTO medicine_category ${db({
        medicine_id,
        category_id,
      })}`;
      return reply.status(201).send({ message: "Link created!", created });
    }
  );
};
