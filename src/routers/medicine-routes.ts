import { FMedController } from "../controllers/FMedController";
import { MedicamentoRepository } from "../repositories/mongo/MedicamentoRepository";

import { FastifyInstance } from "fastify";
import { MedicService } from "../services/medic-service";
import { StorageProvider } from "../providers/storage-provider";
import {
  deleteMedicine,
  distinctMedicine,
  filterByScope,
  getById,
  postMedicine,
  search,
  updateMedicine,
  uploadMedicineImage,
} from "./schemas/medicine-schemas";

export const med_routes = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      schema: { summary: "Redirect to /docs" },
    },
    (_, reply) => {
      reply.redirect("/docs");
    }
  );

  const medRepo = new MedicamentoRepository();
  const medService = new MedicService(medRepo);
  const medController = new FMedController(medService);

  // Grupo de rotas com prefixo /medicine
  app.register(
    async (medicineRoutes) => {
      medicineRoutes.get(
        "/:id",
        getById,
        medController.getById.bind(medController)
      );

      medicineRoutes.get(
        "/search/:name",
        search,
        medController.search.bind(medController)
      );

      medicineRoutes.get(
        "/:scope/:value",
        filterByScope,
        medController.filter.bind(medController)
      );

      medicineRoutes.get(
        "/distinct/:scope",
        distinctMedicine,
        medController.distinct.bind(medController)
      );

      medicineRoutes.post(
        "/",
        postMedicine,
        medController.save.bind(medController)
      );

      medicineRoutes.delete(
        "/:id",
        deleteMedicine,
        medController.deleteById.bind(medController)
      );

      medicineRoutes.put(
        "/:id",
        updateMedicine,
        medController.updateMedicine.bind(medController)
      );

      medicineRoutes.put(
        "/images/:med_id",
        uploadMedicineImage,
        medController.uploadMedImage.bind(medController)
      );
    },
    { prefix: "/medicine" }
  );
};
