import { FastifyInstance } from "fastify";
import { createUser } from "./users/create-user";
import { appServices } from "../generators/app-services";

export const user_routes = (app: FastifyInstance) => {
  app.register(createUser(appServices.user))
};
