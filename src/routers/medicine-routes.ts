import { FastifyInstance } from "fastify";
import { listMedicines } from "./medicines/list-medicines";
import { appServices } from "@/generators/app-services";
import { getMedicineById } from "./medicines/get-medicine-by-id";
import { searchMedicine } from "./medicines/search-medicine";
import uploadRoutes from "./medicines/upload-medicine-photo";
import { appProviders } from "@/generators/app-providers";

export const med_routes = async (app: FastifyInstance) => {
  app.register(listMedicines(appServices.med));
  app.register(getMedicineById(appServices.med));
  app.register(searchMedicine(appServices.med));
  app.register(uploadRoutes, {
    medicineMediaProvider: appProviders.medicineMedia,
  });
};
