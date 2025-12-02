import { FastifyPluginAsync } from "fastify";
import { UserService } from "../../services/user-service";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { zUser } from "@/models/User";

export const updateUser = (service: UserService): FastifyPluginAsync => {
  return async (app) => {
    const server = app.withTypeProvider<ZodTypeProvider>();
    server.patch(
      "/users/:id",
      {
        schema: {
          summary: "Update user by id",
          tags: ["users"],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            fields: zUser.omit({ id: true, createdAt: true, password: true }),
          }),
        },
      },
      async (req, reply) => {
        const { id } = req.params;
        const { fields } = req.body;
        await service.updateUserById(id, fields);
        return reply.status(200).send();
      }
    );
  };
};
