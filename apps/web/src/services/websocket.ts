type SentinelRealtimeMessage = {
  type: string;
  payload: unknown;
  timestamp?: string;
};

type MessageHandler = (
  message: SentinelRealtimeMessage
) => void;

let socket: WebSocket | null = null;

const listeners =
  new Set<MessageHandler>();

export function connectWebSocket() {
  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    return;
  }

  socket = new WebSocket(
    "ws://localhost:3333/ws"
  );

  socket.addEventListener(
    "open",
    () => {
      console.log(
        "[WS] Conectado ao SENTINEL"
      );
    }
  );

  socket.addEventListener(
    "message",
    (event) => {
      const message =
        JSON.parse(event.data);

      for (const listener of listeners) {
        listener(message);
      }
    }
  );

  socket.addEventListener(
    "close",
    () => {
      console.log(
        "[WS] Conexão encerrada"
      );

      socket = null;
    }
  );

  socket.addEventListener(
    "error",
    (error) => {
      console.error(
        "[WS] Erro:",
        error
      );
    }
  );
}

export function subscribeRealtime(
  handler: MessageHandler
) {
  listeners.add(handler);

  return () => {
    listeners.delete(handler);
  };
}