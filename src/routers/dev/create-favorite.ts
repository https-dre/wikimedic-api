import { favoriteRepository } from "@/generators/temp";
import { zFavorite } from "@/models/Favorite";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const createFavorite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/favorites", {
      schema: {
        summary: "Create medicine favorite",
        tags: ['favorites'],
        body: z.object({
          favorite: zFavorite.omit({ id: true, medicineName: true })
        })
      }
    }, async (req, reply) => {
      const { favorite } = req.body;
      const created = favoriteRepository.save(favorite);
      return reply.status(201).send({ created });
    });
};
