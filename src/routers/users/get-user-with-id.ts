import { zUser } from "@/models/User";
import { UserService } from "@/services/user-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const getUserWithId = (service: UserService): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().get(
      "/users/:userId",
      {
        schema: {
          summary: "Get user by Id",
          tags: ["users"],
          params: z.object({
            userId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              user: zUser.omit({ password: true }),
            })
          },
        },
      },
      async (req, reply) => {
        const { userId } = req.params;
        const user = await service.getUserById(userId);
        return reply.status(200).send({ user });
      }
    );
  };
};
