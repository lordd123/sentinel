import type {
  FastifyInstance,
} from "fastify";

import {
  listUsersController,
  updateUserRoleController,
} from "./users.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/authorize.middleware";

export async function usersRoutes(
  app: FastifyInstance
) {
  app.get(
    "/admin/users",
    {
      preHandler: [
        authenticate,
        authorize(["ADMIN"]),
      ],
    },
    listUsersController
  );

  app.patch(
    "/admin/users/:id/role",
    {
      preHandler: [
        authenticate,
        authorize(["ADMIN"]),
      ],
    },
    updateUserRoleController
  );
}