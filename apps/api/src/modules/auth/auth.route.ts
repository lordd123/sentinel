import type {
  FastifyInstance,
} from "fastify";

import {
  loginController,
  registerController,
} from "./auth.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/authorize.middleware";

export async function authRoutes(
  app: FastifyInstance
) {
  // Cadastro
  app.post(
    "/auth/register",
    registerController
  );

  // Login
  app.post(
    "/auth/login",
    loginController
  );

  // Teste exclusivo para ADMIN
  app.get(
    "/admin/test",
    {
      preHandler: [
        authenticate,
        authorize(["ADMIN"]),
      ],
    },
    async () => {
      return {
        message:
          "Área exclusiva de ADMIN.",
      };
    }
  );
}