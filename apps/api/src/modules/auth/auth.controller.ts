 import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  loginSchema,
  registerSchema,
} from "./auth.schema";

import {
  AuthService,
} from "./auth.service";

const authService = new AuthService();

// ========================================
// CADASTRO
// ========================================

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation =
    registerSchema.safeParse(
      request.body
    );

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_REGISTER_DATA",
      message:
        "Os dados de cadastro são inválidos.",
      details:
        validation.error.issues,
    });
  }

  try {
    const user =
      await authService.register(
        validation.data
      );

    return reply
      .status(201)
      .send(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "EMAIL_ALREADY_EXISTS"
    ) {
      return reply.status(409).send({
        error:
          "EMAIL_ALREADY_EXISTS",
        message:
          "Já existe um usuário com este e-mail.",
      });
    }

    throw error;
  }
}

// ========================================
// LOGIN
// ========================================

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation =
    loginSchema.safeParse(
      request.body
    );

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_LOGIN_DATA",
      message:
        "Os dados de login são inválidos.",
      details:
        validation.error.issues,
    });
  }

  try {
    const user =
      await authService.login(
        validation.data
      );

    const accessToken =
      await reply.jwtSign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

    return reply.status(200).send({
      accessToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVALID_CREDENTIALS"
    ) {
      return reply.status(401).send({
        error:
          "INVALID_CREDENTIALS",
        message:
          "E-mail ou senha inválidos.",
      });
    }

    throw error;
  }
}