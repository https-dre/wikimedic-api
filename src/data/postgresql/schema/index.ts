import { logger } from "../../../logger";
import { db } from "../db";
import { readFile } from "node:fs";

const runSchema = async () => {
  let schemaContent: string = ""; 
  readFile(__dirname + "/schema.sql", (err, data) => {
    if(err) {
      logger.fatal(err);
      process.exit(1);
    }
    schemaContent = data.toLocaleString();
    console.log(schemaContent);
  });
  try {
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