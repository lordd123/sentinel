import type { WebSocket } from "ws";

const clients = new Set<WebSocket>();

export function addWebSocketClient(
  socket: WebSocket
) {
  clients.add(socket);

  console.log(
    `[WS] Cliente conectado. Total: ${clients.size}`
  );
}

export function removeWebSocketClient(
  socket: WebSocket
) {
  clients.delete(socket);

  console.log(
    `[WS] Cliente desconectado. Total: ${clients.size}`
  );
}

export function broadcast(
  type: string,
  payload: unknown
) {
  const message = JSON.stringify({
    type,
    payload,
    timestamp: new Date().toISOString(),
  });

  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}