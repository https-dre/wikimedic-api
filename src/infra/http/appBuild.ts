import fastifySwagger from "@fastify/swagger";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ServerErrorHandler } from "@/lib/errors/error-handler";
import { logger } from "@/lib/logger";
import { main_router } from "@/routers";

import cors from "@fastify/cors";

export const buildApp = () => {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.register(cors, {
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization", "APIKEY"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  });

  app.register(import("@fastify/multipart"));

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Wikimedic API",
        description:
          "To execute POST, PUT, and DELETE requests, the request must include the APIKEY header.",
        version: "2.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.setErrorHandler(ServerErrorHandler);
  app.register(main_router);

  if (!process.env.APIKEY) {
    process.env.APIKEY = Math.random().toString();
    logger.info(
      `Missing env APIKEY, new random APIKEY was generated: ${process.env.APIKEY}`
    );
  }

  /*   app.addHook("onRequest", async (request, reply) => {
    const filter = ["post", "put", "delete"];
    const req_method = request.method.toLowerCase();
    const methods = filter.filter((e) => e == req_method);

    if (methods.length > 0) {
      // check API token
      const token = request.headers["apikey"];
      if (token != process.env.APIKEY) {
        return reply.code(401).send("Unauthorized");
      }
    }
  }); */
  app.register(import("@scalar/fastify-api-reference"), {
    routePrefix: "/openapi",
    configuration: {
      theme: "kepler",
    },
  });

  app.decorateRequest("contextData", undefined);
  return app;
};
