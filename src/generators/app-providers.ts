import { db } from "@/infra/sql";
import { config } from "@/lib/config";
import { MedicineMediaProvider } from "@/lib/providers/medicine-media-provider";
import { S3Provider } from "@/lib/providers/s3-provider";
import { MedicineRepository } from "@/lib/repositories";

const s3MediaProvider = new S3Provider(
  config.get("AWS_REGION")!,
  config.get("AWS_BUCKET")!,
  "medicine-images"
);

const medicineRepository = new MedicineRepository(db);

const appProviders = {
  medicineMedia: new MedicineMediaProvider(s3MediaProvider, medicineRepository),
};

export { appProviders };
