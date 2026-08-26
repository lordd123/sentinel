import type {
  FastifyInstance,
} from "fastify";

import {
  broadcast,
} from "../websocket/websocket-manager";

export async function internalRoutes(
  app: FastifyInstance
) {
  app.post(
    "/internal/realtime/alert",
    async (
      request,
      reply
    ) => {
      const expectedKey =
        process.env.INTERNAL_API_KEY;

      if (!expectedKey) {
        throw new Error(
          "INTERNAL_API_KEY não configurada."
        );
      }

      const receivedKey =
        request.headers[
          "x-internal-api-key"
        ];

      if (
        receivedKey !==
        expectedKey
      ) {
        return reply
          .status(401)
          .send({
            error:
              "INVALID_INTERNAL_KEY",
            message:
              "Acesso interno não autorizado.",
          });
      }

      broadcast(
        "ALERT_CREATED",
        request.body
      );

      return reply
        .status(204)
        .send();
    }
  );
}