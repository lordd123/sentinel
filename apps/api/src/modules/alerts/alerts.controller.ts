import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { AlertsService } from "./alerts.service";

import {
  alertParamsSchema,
  listAlertsQuerySchema,
} from "./alerts.schema";

const alertsService =
  new AlertsService();

export async function listAlertsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation =
    listAlertsQuerySchema.safeParse(
      request.query
    );

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_QUERY",
      message:
        "Os filtros enviados são inválidos.",
      details:
        validation.error.issues,
    });
  }

  const result =
    await alertsService.findAll(
      validation.data
    );

  return reply
    .status(200)
    .send(result);
}

export async function getAlertByIdController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation =
    alertParamsSchema.safeParse(
      request.params
    );

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_ALERT_ID",
      message:
        "O ID informado é inválido.",
      details:
        validation.error.issues,
    });
  }

  const alert =
    await alertsService.findById(
      validation.data.id
    );

  if (!alert) {
    return reply.status(404).send({
      error: "ALERT_NOT_FOUND",
      message:
        "Alerta não encontrado.",
    });
  }

  return reply
    .status(200)
    .send(alert);
}