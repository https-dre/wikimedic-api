import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserService } from "../../services/user-service";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const deleteUser = (service: UserService): FastifyPluginAsync => {
  return async (app) => {
    const server = app.withTypeProvider<ZodTypeProvider>();
    server.delete(
      "/users/:id",
      {
        schema: {
          summary: "Delete user",
          tags: ["users"],
          params: z.object({
            id: z.string().uuid(),
          }),
        },
      },
      async (req, reply) => {
        const { id } = req.params;
        await service.deleteUser(id);
        return reply.status(204).send();
      }
    );
  };
};
