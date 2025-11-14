import postgres from "postgres";
import EnvConfig from "../../env-config";

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

export { db };
