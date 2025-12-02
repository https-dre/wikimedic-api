import { db } from "@/data/postgresql/db";
import { Category, zCategory } from "@/types/categories";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export const createCategory = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/medicines/categories/",
    {
      schema: {
        summary: "Create category",
        tags: ["medicines", "dev"],
        body: z.object({
          categories: z.array(zCategory.omit({ id: true })),
        }),
      },
    },
    async (req, reply) => {
      let { categories } = req.body;
      const toCreate = categories.map(c => ({ ...c, id: randomUUID() }))
      const result = await db<Category[]>`INSERT INTO categories ${db(
        toCreate
      )}`;
      return reply.status(201).send({ categories: result });
    }
  );
};
