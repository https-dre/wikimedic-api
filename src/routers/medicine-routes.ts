import { FastifyInstance } from "fastify";
import { listMedicines } from "./medicines/list-medicines";
import { appServices } from "@/generators/app-services";
import { getMedicineById } from "./medicines/get-medicine-by-id";
import { searchMedicine } from "./medicines/search-medicine";
import { uploadMedicinePhoto } from "./medicines/upload-medicine-photo";
import { appProviders } from "@/generators/app-providers";
import { listMedicinePhotos } from "./medicines/list-medicine-photos";
import { deleteMedicinePhoto } from "./medicines/delete-medicine-photo";
import { updateMedicieFields } from "./medicines/update-medicine-fields";
import { updateMedicineLeaflet } from "./medicines/update-medicine-leaflet";

export const med_routes = async (app: FastifyInstance) => {
  app.register(listMedicines(appServices.med));
  app.register(getMedicineById(appServices.med));
  app.register(searchMedicine(appServices.med));
  app.register(uploadMedicinePhoto, {
    medicineMediaProvider: appProviders.medicineMedia,
  });
  app.register(listMedicinePhotos, {
    medicineMediaProvider: appProviders.medicineMedia,
  });
  app.register(deleteMedicinePhoto, {
    medicineMediaProvider: appProviders.medicineMedia,
  });
  app.register(updateMedicieFields, {
    service: appServices.med,
  });
  app.register(updateMedicineLeaflet);
};
