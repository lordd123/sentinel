import type { FastifyInstance } from "fastify";

import {
  addWebSocketClient,
  removeWebSocketClient,
} from "./websocket-manager";

export async function websocketRoutes(
  app: FastifyInstance
) {
  app.get(
    "/ws",
    {
      websocket: true,
    },
    (socket) => {
      addWebSocketClient(socket);

      socket.send(
        JSON.stringify({
          type: "CONNECTED",
          payload: {
            message:
              "Conectado ao SENTINEL realtime.",
          },
        })
      );

      socket.on("close", () => {
        removeWebSocketClient(socket);
      });
    }
  );
}