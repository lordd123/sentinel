import Fastify from "fastify";
import cors from "@fastify/cors";

import { healthRoutes } from "./routes/health.route";
import { eventsRoutes } from "./modules/events/events.route";
import { globalErrorHandler } from "./errors/error-handler";
import { alertsRoutes } from "./modules/alerts/alerts.route";
import websocket from "@fastify/websocket";
import { websocketRoutes } from "./websocket/websocket.route";
import { internalRoutes } from "./routes/internal.route";
import { authRoutes } from "./modules/auth/auth.route";
import jwt from "@fastify/jwt";
import {
  usersRoutes,
} from "./modules/users/users.route";
import crypto from "node:crypto";

export function buildApp() {

    
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET não configurada."
  );
}



 
const app = Fastify({
  logger: {
    level: "info",
  },

  genReqId: () => {
    return crypto.randomUUID();
  },
});

app.addHook(
  "onSend",
  async (
    request,
    reply,
    payload
  ) => {
    reply.header(
      "x-request-id",
      request.id
    );

    return payload;
  }
);

app.addHook(
  "onRequest",
  async (request) => {
    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
      },
      "request_received"
    );
  }
);

app.addHook(
  "onResponse",
  async (
    request,
    reply
  ) => {
    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode:
          reply.statusCode,
      },
      "request_completed"
    );
  }
);

  app.register(websocket);

  app.setErrorHandler(globalErrorHandler);
  app.register(cors, {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
});

app.register(jwt, {
  secret: jwtSecret,
  sign: {
    expiresIn: "15m",
  },
});
  app.register(usersRoutes);
  app.register(authRoutes);
  app.register(internalRoutes);
  app.register(websocketRoutes);
  app.register(alertsRoutes);
  app.register(healthRoutes);
  app.register(eventsRoutes);

  app.get("/", async () => {
    return {
      name: "SENTINEL API",
      status: "online",
    };
  });

  return app;
}