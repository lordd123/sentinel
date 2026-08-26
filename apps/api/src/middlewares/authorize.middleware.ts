import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

type Role =
  | "ADMIN"
  | "ANALYST"
  | "VIEWER";

export function authorize(
  allowedRoles: Role[]
) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const user = request.user as {
      sub: string;
      email: string;
      role: Role;
    };

    if (
      !allowedRoles.includes(
        user.role
      )
    ) {
      return reply.status(403).send({
        error: "FORBIDDEN",
        message:
          "Você não tem permissão para acessar este recurso.",
      });
    }
  };
}