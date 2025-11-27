import { FastifyInstance } from "fastify";
import { createUser } from "./users/create-user";
import { appServices } from "../generators/app-services";
import { deleteUser } from "./users/delete-user";
import { updateUser } from "./users/update-user";
import { userLogin } from "./users/user-login";
import { getUserWithId } from "./users/get-user-with-id";

export const user_routes = (app: FastifyInstance) => {
  app.register(createUser(appServices.user));
  app.register(deleteUser(appServices.user));
  app.register(updateUser(appServices.user));
  app.register(userLogin(appServices.user));
  app.register(getUserWithId(appServices.user));
};
