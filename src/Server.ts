import { mongo as Database } from "./data/mongoDB/conn";
import { logger } from "./logger";
import { verify_env } from "./env-config";
import { buildApp } from "./appBuild";
import { testPostgreSqlConnection } from "./data/postgresql/db";
const port = process.env.PORT || "7711";

const run = async () => {
  verify_env();
  const app = buildApp();

  await app.ready();
  await testPostgreSqlConnection();
  await Database.conn();

  try {
    const address = await app.listen({ port: Number(port), host: "0.0.0.0" });
    logger.info("Server running at: " + address);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
};

run();
