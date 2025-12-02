import { FastifyInstance } from "fastify";
import { createAppointment } from "./appointment/create-appointment";
import { appServices } from "../generators/app-services";
import { deleteAppointment } from "./appointment/delete-appointment";
import { listAppointmentsByUserId } from "./appointment/list-appointments-by-user-id";
import { createDoseRecord } from "./appointment/create-dose-record";
import { getTreatmentSummary } from "./appointment/get-treatment-summary";

export const appointment_routes = (app: FastifyInstance) => {
  app.register(createAppointment(appServices.appointment));
  app.register(deleteAppointment(appServices.appointment));
  app.register(listAppointmentsByUserId(appServices.appointment));
  app.register(createDoseRecord(appServices.appointment));
  app.register(getTreatmentSummary(appServices.appointment));
};
