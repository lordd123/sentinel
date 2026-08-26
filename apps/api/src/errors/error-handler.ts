import {
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export async function globalErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(
    {
      err: error,
      method: request.method,
      url: request.url,
    },
    "Erro não tratado na aplicação"
  );

  return reply.status(500).send({
    error: "INTERNAL_SERVER_ERROR",
    message: "Ocorreu um erro interno no servidor.",
  });
}