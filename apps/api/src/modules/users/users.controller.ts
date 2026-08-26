import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  UsersService,
} from "./users.service";

import {
  updateUserRoleSchema,
  userParamsSchema,
} from "./users.schema";

const usersService =
  new UsersService();

export async function listUsersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const users =
    await usersService.findAll();

  return reply
    .status(200)
    .send(users);
}

export async function updateUserRoleController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsValidation =
    userParamsSchema.safeParse(
      request.params
    );

  if (!paramsValidation.success) {
    return reply.status(400).send({
      error: "INVALID_USER_ID",
      message:
        "O ID do usuário é inválido.",
    });
  }

  const bodyValidation =
    updateUserRoleSchema.safeParse(
      request.body
    );

  if (!bodyValidation.success) {
    return reply.status(400).send({
      error: "INVALID_ROLE",
      message:
        "O cargo informado é inválido.",
      details:
        bodyValidation.error.issues,
    });
  }

  try {
    const user =
      await usersService.updateRole(
        paramsValidation.data.id,
        bodyValidation.data.role
      );

    return reply
      .status(200)
      .send(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "USER_NOT_FOUND"
    ) {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message:
          "Usuário não encontrado.",
      });
    }

    throw error;
  }
}