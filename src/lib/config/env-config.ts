import { z } from "zod";
import { logger } from "@/lib/logger";

export const config = new Map<string, string>(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  )
);

const envSchema = z.object({
  MONGO_URL: z.string().url(),
  BUCKET_NAME: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  JWT_KEY: z.string(),
  APIKEY: z.string().optional(),
  PGUSER: z.string(),
  PGHOST: z.string(),
  PGPASSWORD: z.string(),
  PGDATABASE: z.string(),
  PGSSLMODE: z.string()
});

const validateEnv = () => {
  const { success, error } = envSchema.safeParse(process.env);
  if(!success) {
    logger.fatal("Environment check fails");
    logger.error(error);
    process.exit(1);
  }
}

export const verify_env = () => {
  logger.info("Checking environment...");
  validateEnv();
  logger.info("Environment ok!");
};

