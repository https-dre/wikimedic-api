import postgres from "postgres";
import EnvConfig from "../../env-config";
import { logger } from "../../logger";

const db = postgres({
  user: EnvConfig.get("PGUSER"),
  host: EnvConfig.get("PGHOST"),
  port: 5432,
  password: EnvConfig.get("PGPASSWORD"),
  db: EnvConfig.get("PGDATABASE"),
  ssl: EnvConfig.get("PGSSLMODE") as
    | boolean
    | object
    | "require"
    | "allow"
    | "prefer"
    | "verify-full"
    | undefined,
  
});

const testPostgreSqlConnection = async () => {
  try {
    logger.info("Testing PostgreSql Connection");
    await db`SELECT 1`;
    logger.info("PostgreSql Ok!")
  } catch (err) {
    logger.fatal(err)
  }
}

export { db, testPostgreSqlConnection };
