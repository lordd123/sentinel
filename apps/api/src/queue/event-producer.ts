import { getRabbitMQChannel } from "./rabbitmq";

const EVENTS_QUEUE = "sentinel.events";

export async function publishEvent(event: unknown) {
  const channel = await getRabbitMQChannel();

  await channel.assertQueue(EVENTS_QUEUE, {
    durable: true,
  });

  const message = Buffer.from(
    JSON.stringify(event)
  );

  channel.sendToQueue(
    EVENTS_QUEUE,
    message,
    {
      persistent: true,
    }
  );
}