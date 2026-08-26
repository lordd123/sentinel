import {
  useEffect,
  useState,
} from "react";

import {
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  getUsers,
  updateUserRole,
} from "../services/admin";

import {
  handleApiError,
} from "../services/errors";

import type {
  AdminUser,
} from "../types/user";

import type {
  UserRole,
} from "../types/auth";

export function AdminUsers() {
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [updatingId, setUpdatingId] =
    useState<string | null>(
      null
    );

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await getUsers();

      setUsers(response);
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error &&
        error.message ===
          "FORBIDDEN"
      ) {
        handleApiError(error);
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "SESSION_EXPIRED"
      ) {
        return;
      }

      setError(
        "Não foi possível carregar os usuários."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(
    userId: string,
    role: UserRole
  ) {
    try {
      setUpdatingId(userId);

      const updatedUser =
        await updateUserRole(
          userId,
          role
        );

      setUsers(
        (currentUsers) =>
          currentUsers.map(
            (user) =>
              user.id ===
              updatedUser.id
                ? {
                    ...user,
                    role:
                      updatedUser.role,
                  }
                : user
          )
      );
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error &&
        error.message ===
          "FORBIDDEN"
      ) {
        handleApiError(error);
        return;
      }

      setError(
        "Não foi possível alterar o cargo."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-kicker">
            Administration
          </span>

          <h1>
            Usuários e acessos
          </h1>

          <p>
            Gerencie usuários e níveis
            de acesso do SENTINEL.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadUsers}
        >
          <RefreshCw size={15} />
          Atualizar
        </button>
      </div>

      <div className="admin-summary">
        <article className="stat-card">
          <span>
            Usuários
          </span>

          <strong>
            {users.length}
          </strong>

          <small>
            Contas cadastradas
          </small>
        </article>

        <article className="stat-card">
          <span>
            Administradores
          </span>

          <strong>
            {
              users.filter(
                (user) =>
                  user.role ===
                  "ADMIN"
              ).length
            }
          </strong>

          <small>
            Acesso total
          </small>
        </article>

        <article className="stat-card">
          <span>
            Analistas
          </span>

          <strong>
            {
              users.filter(
                (user) =>
                  user.role ===
                  "ANALYST"
              ).length
            }
          </strong>

          <small>
            Investigação
          </small>
        </article>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>
              <Users
                size={15}
                style={{
                  marginRight: 7,
                  verticalAlign:
                    "middle",
                }}
              />

              Controle de acesso
            </h2>

            <p>
              Altere o papel de cada
              usuário.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="table-state">
            Carregando usuários...
          </div>
        ) : error ? (
          <div className="table-state error-state">
            {error}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Cargo</th>
                  <th>Acesso</th>
                </tr>
              </thead>

              <tbody>
                {users.map(
                  (user) => (
                    <tr
                      key={
                        user.id
                      }
                    >
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">
                            {user.name
                              .split(
                                " "
                              )
                              .filter(
                                Boolean
                              )
                              .map(
                                (
                                  part
                                ) =>
                                  part[0]
                              )
                              .slice(
                                0,
                                2
                              )
                              .join(
                                ""
                              )
                              .toUpperCase()}
                          </div>

                          <strong>
                            {
                              user.name
                            }
                          </strong>
                        </div>
                      </td>

                      <td>
                        {
                          user.email
                        }
                      </td>

                      <td>
                        <select
                          className="role-select"
                          value={
                            user.role
                          }
                          disabled={
                            updatingId ===
                            user.id
                          }
                          onChange={(
                            event
                          ) =>
                            handleRoleChange(
                              user.id,
                              event
                                .target
                                .value as UserRole
                            )
                          }
                        >
                          <option value="VIEWER">
                            VIEWER
                          </option>

                          <option value="ANALYST">
                            ANALYST
                          </option>

                          <option value="ADMIN">
                            ADMIN
                          </option>
                        </select>
                      </td>

                      <td>
                        <div className="role-description">
                          <ShieldCheck
                            size={
                              14
                            }
                          />

                          {user.role ===
                          "ADMIN"
                            ? "Acesso total"
                            : user.role ===
                              "ANALYST"
                            ? "Investigação"
                            : "Visualização"}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}