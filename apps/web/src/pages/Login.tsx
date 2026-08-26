import {
  useState,
  type FormEvent,
} from "react";

import {
  login,
} from "../services/auth";

export function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        email,
        password
      );

      window.location.href =
        "/dashboard";
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "INVALID_CREDENTIALS"
      ) {
        setError(
          "E-mail ou senha inválidos."
        );
      } else {
        setError(
          "Não foi possível realizar o login."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="login-logo">
            S
          </span>

          <div>
            <strong>SENTINEL</strong>
            <span>
              Security Operations
            </span>
          </div>
        </div>

        <div className="login-heading">
          <span>
            SECURE ACCESS
          </span>

          <h1>
            Bem-vindo de volta
          </h1>

          <p>
            Entre para acessar o painel
            de monitoramento.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label>
            E-mail

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="admin@sentinel.local"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Senha

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Sua senha"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        <div className="login-footer">
          SENTINEL Security Platform
        </div>
      </section>
    </main>
  );
}