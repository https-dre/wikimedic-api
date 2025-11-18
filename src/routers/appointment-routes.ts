import { FastifyInstance } from "fastify";
import { createAppointment } from "./appointment/create-appointment";
import { appServices } from "../generators/app-services";
import { deleteAppointment } from "./appointment/delete-appointment";

export const appointment_routes = (app: FastifyInstance) => {
  app.register(createAppointment(appServices.appointment))
  app.register(deleteAppointment(appServices.appointment))
};
