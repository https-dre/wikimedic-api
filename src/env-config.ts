import { z } from "zod";
import { logger } from "./logger";

const EnvConfig = new Map<string, string>(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  )
);

const envSchema = z.object({
  MONGO_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  IMAGE_BUCKET_NAME: z.string(),
  JWT_KEY: z.string(),
  APIKEY: z.string().optional()
});

const validateEnv = () => {
  const { success, error } = envSchema.safeParse(process.env);
  if(!success) {
    logger.fatal("Environment check fails");
    logger.error(error);
    process.exit(1);
  }
}

const vars = ["MONGO_URL", "SUPABASE_URL", "SUPABASE_KEY", "IMAGE_BUCKET_NAME", "JWT_KEY","APIKEY"];

export const verify_env = () => {
  logger.info("Checking environment...");
  const missingVars = vars.filter((v) => !EnvConfig.has(v));
  if (missingVars.length) {
    logger.fatal(`Missing: ${missingVars.join(", ")}`);
    process.exit(1);
  }
  validateEnv();
  logger.info("Environment ok!");
};

export default EnvConfig;

