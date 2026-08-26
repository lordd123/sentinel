import amqp from "amqplib";

const QUEUE_NAME = "sentinel.events";

async function startWorker() {
  const rabbitmqUrl = process.env.RABBITMQ_URL;

  if (!rabbitmqUrl) {
    throw new Error("RABBITMQ_URL não configurada.");
  }

  const connection = await amqp.connect(rabbitmqUrl);

  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  console.log("SENTINEL Worker iniciado");
  console.log(`Aguardando mensagens em: ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, async (message) => {
    if (!message) {
      return;
    }

    const content = message.content.toString();

    const event = JSON.parse(content);

    console.log("Evento recebido pelo Worker:");
    console.log(event);

    channel.ack(message);
  });
}

startWorker().catch((error) => {
  console.error("Erro ao iniciar Worker:", error);
  process.exit(1);
});