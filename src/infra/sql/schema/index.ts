import path from "path";
import { logger } from "../@/lib/logger";
import { db } from "../db";
import * as fs from "node:fs";

const runSchema = async () => {
  try {
    const schemaFilePath = path.join(__dirname, 'schema.sql');
    const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');
    logger.info("Executing SQL Schema...");
    await db.unsafe(schemaContent)
    logger.info("Schema applied!");
    process.exit(0);
  } catch (err) {
    logger.fatal(err);
    process.exit(1);
  }
}

runSchema();