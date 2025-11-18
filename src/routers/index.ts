import { FastifyInstance } from "fastify";
import { user_routes } from "./user-routes";
import { med_routes } from "./medicine-routes";
import { appointment_routes } from "./appointment-routes";

export const main_router = (app: FastifyInstance) => {
  user_routes(app);
  med_routes(app);
  appointment_routes(app);
}