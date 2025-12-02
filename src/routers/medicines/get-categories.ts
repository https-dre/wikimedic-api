import { db } from "@/data/postgresql/db";
import { Category, zCategory } from "@/types/categories";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const getCategories = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/medicines/categories",
    {
      schema: {
        summary: "Get categories",
        tags: ["medicines", "dev"],
        response: {
          200: z.object({
            categories: z.array(zCategory),
          }),
        },
      },
    },
    async (req, reply) => {
      const categories = await db<Category[]>`SELECT * FROM categories`;
      return reply.status(200).send({ categories });
    }
  );
};
