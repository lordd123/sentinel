import type {
  AdminUser,
} from "../types/user";

import type {
  UserRole,
} from "../types/auth";

import {
  apiFetch,
} from "./http";

export async function getUsers() {
  const response =
    await apiFetch(
      "/admin/users"
    );

  if (response.status === 403) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os usuários."
    );
  }

  return response.json() as Promise<
    AdminUser[]
  >;
}

export async function updateUserRole(
  id: string,
  role: UserRole
) {
  const response =
    await apiFetch(
      `/admin/users/${id}/role`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          role,
        }),
      }
    );

  if (response.status === 403) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  if (response.status === 404) {
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  if (!response.ok) {
    throw new Error(
      "Não foi possível alterar o cargo."
    );
  }

  return response.json() as Promise<
    AdminUser
  >;
}