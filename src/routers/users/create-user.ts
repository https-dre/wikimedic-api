import { z } from "zod";
import { UserService } from "../../services/user-service";
import { FastifyPluginAsync } from "fastify";
import { zUser } from "../../models/User";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const createUser = (service: UserService): FastifyPluginAsync => {
  return async (app) => {
    const server = app.withTypeProvider<ZodTypeProvider>();
    server.post(
      "/users/",
      {
        schema: {
          summary: "Create user",
          tags: ["users"],
          body: z.object({
            user: zUser.omit({ id: true, created_at: true }),
          }),
          response: {
            201: z.object({
              userId: z.string().uuid(),
            }),
          },
        },
      },
      async (req, reply) => {
        const { user } = req.body;
        const created = await service.saveUser(user);
        return reply.status(201).send({ userId: created.id });
      }
    );
  };
};
