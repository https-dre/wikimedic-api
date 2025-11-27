import { zUser } from "@/models/User";
import { UserService } from "@/services/user-service";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export const userLogin = (service: UserService): FastifyPluginAsync => {
  return async (app) => {
    app.withTypeProvider<ZodTypeProvider>().patch(
      "/users/auth",
      {
        schema: {
          summary: "Authenticate user",
          tags: ["users"],
          body: z.object({
            email: z.string().email(),
            password: z.string(),
          }),
          response: {
            201: z.object({
              token: z.string(),
              user: zUser.omit({ password: true }),
            }),
          },
        },
      },
      async (req, reply) => {
        const { email, password } = req.body;
        const payload = await service.genAuth(email, password);
        console.log(payload);
        return reply.status(201).send(payload);
      }
    );
  };
};
