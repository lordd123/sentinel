import type { FastifyInstance } from "fastify";

import {
  createEventController,
  getEventByIdController,
  listEventsController,
} from "./events.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

export async function eventsRoutes(
  app: FastifyInstance
) {
  app.get(
    "/events",
    {
      preHandler: [
        authenticate,
        authorize([
          "ADMIN",
          "ANALYST",
          "VIEWER",
        ]),
      ],
    },
    listEventsController
  );

  app.get(
    "/events/:id",
    {
      preHandler: [
        authenticate,
        authorize([
          "ADMIN",
          "ANALYST",
          "VIEWER",
        ]),
      ],
    },
    getEventByIdController
  );

  app.post(
    "/events",
    createEventController
  );
}