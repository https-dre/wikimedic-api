import { favoriteRepository } from "@/generators/temp";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const removeFavorite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/favorites/:favorite_id",
    {
      schema: {
        summary: "Remove favorite",
        tags: ["favorites"],
        params: z.object({
          favorite_id: z.string().uuid(),
        }),
      },
    },
    async (req, reply) => {
      const { favorite_id } = req.params;
      await favoriteRepository.deleteById(favorite_id);
      return reply.status(204).send();
    }
  );
};
