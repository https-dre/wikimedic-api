import { favoriteRepository } from "@/generators/temp";
import { zFavorite } from "@/models/Favorite";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const getFavorites = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/favorites/:user_id', {
    schema: {
      summary: "Create favorite repository",
      tags: ['favorites'],
      params: z.object({
        user_id: z.string().uuid()
      }),
      response: {
        200: z.array(zFavorite)
      }
    }

  }, async (req, reply) => {
    const { user_id } = req.params;
    const favorites = await favoriteRepository.findByUserId(user_id);
    return reply.status(200).send(favorites);
  })
}