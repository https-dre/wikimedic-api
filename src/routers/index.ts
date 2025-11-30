import { FastifyInstance } from "fastify";
import { user_routes } from "./user-routes";
import { med_routes } from "./medicine-routes";
import { appointment_routes } from "./appointment-routes";
import { dev_routes } from "./dev";

export const main_router = (app: FastifyInstance) => {
  app.get("/", (_, reply) => {
    return reply.redirect("/openapi");
  });
  app.get("/docs", (_, reply) => {
    return reply.redirect("/openapi");
  });
  app.register(user_routes);
  app.register(med_routes);
  app.register(appointment_routes);
  app.register(dev_routes);
};
