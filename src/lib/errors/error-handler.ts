import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export class BadResponse extends Error {
  public response: string | object;
  public status: number;

  constructor(response: string | object, status: number = 400) {
    const message = typeof response === "string" ? response : "Error";

    super(message);

    this.name = "BadResponse";
    this.response = response;
    this.status = status;
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const ServerErrorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    console.error(error);
    return reply.status(400).send({
      message: `Error during validating`,
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadResponse) {
    if (typeof error.response == "string") {
      return reply.code(error.status).send({
        details: error.response,
      });
    }
    return reply.code(error.status).send(error.response);
  }

  if (error instanceof DatabaseError) {
    return reply.status(500).send({ error_type: "Database Error", error });
  }

  logger.fatal(error);
  return reply.status(500).send(error);
};

