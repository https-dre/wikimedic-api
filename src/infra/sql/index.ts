import postgres from "postgres";
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";

const db = postgres({
  user: config.get("PGUSER"),
  host: config.get("PGHOST"),
  port: 5432,
  password: config.get("PGPASSWORD"),
  db: config.get("PGDATABASE"),
  ssl: config.get("PGSSLMODE") as
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
