import { db } from "@/data/postgresql/db";
import { listUsersFromDb } from "@/functions/list-users";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const dev_routes = async (app: FastifyInstance) => {
  const server = app.withTypeProvider<ZodTypeProvider>();
  server.get(
    "/dev/users",
    {
      schema: {
        summary: "List users",
        tags: ["dev"],
      },
    },
    async (_, reply) => {
      const users = await listUsersFromDb(db);
      return reply.status(200).send({ users });
    }
  );
};
