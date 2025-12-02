import { logger } from "@/lib/logger";
import { verify_env } from "@/lib/config";
import { buildApp } from "@/infra/http";
import { testPostgreSqlConnection } from "@/infra/sql";
const port = process.env.PORT || "7711";

const run = async () => {
  verify_env();
  const app = buildApp();
  const testPromise = testPostgreSqlConnection();

  try {
    const address = await app.listen({ port: Number(port), host: "0.0.0.0" });
    logger.info("Server running at: " + address);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
  await testPromise;
};

run();