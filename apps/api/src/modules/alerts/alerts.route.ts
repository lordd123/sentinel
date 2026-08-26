import { FastifyInstance } from "fastify";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

import {
  getAlertByIdController,
  listAlertsController,
} from "./alerts.controller";

export async function alertsRoutes(
  app: FastifyInstance
) {
app.get(
  "/alerts",
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
  listAlertsController
);

app.get(
  "/alerts/:id",
  {
    preHandler: [
      authenticate,
      authorize([
        "ADMIN",
        "ANALYST",
      ]),
    ],
  },
  getAlertByIdController
);
}