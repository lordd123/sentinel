import amqp from "amqplib";

let connection: any;
let channel: any;

export async function getRabbitMQChannel() {
  if (channel) {
    return channel;
  }

  const rabbitmqUrl = process.env.RABBITMQ_URL;

  if (!rabbitmqUrl) {
    throw new Error("RABBITMQ_URL não configurada.");
  }

  connection = await amqp.connect(rabbitmqUrl);

  channel = await connection.createChannel();

  return channel;
}