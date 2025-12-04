import { db } from "@/infra/sql";
import { listUsersFromDb } from "@/lib/functions/list-users";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createCategory } from "../medicines/create-category";
import { pushCategory } from "../medicines/push-category";
import { getCategories } from "../medicines/get-categories";
import { createFavorite } from "./create-favorite";
import { removeFavorite } from "./remove-favorite";
import { getFavorites } from "./get-favorites";

export const dev_routes = async (app: FastifyInstance) => {
  app.register(createCategory);
  app.register(pushCategory);
  app.register(getCategories);
  app.register(createFavorite);
  app.register(removeFavorite);
  app.register(getFavorites);
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
