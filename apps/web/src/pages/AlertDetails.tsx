import {
  ArrowLeft,
  Calendar,
  Fingerprint,
  ShieldAlert,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAlertById,
} from "../services/api";

import {
  handleApiError,
} from "../services/errors";

import type {
  SentinelAlert,
} from "../types/alert";

export function AlertDetails() {
  const { id } = useParams();

  const [alert, setAlert] =
    useState<SentinelAlert | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadAlert() {
      if (!id) {
        setError(
          "ID do alerta não informado."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await getAlertById(id);

        if (!response) {
          setError(
            "Alerta não encontrado."
          );

          return;
        }

        setAlert(response);
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
          "Não foi possível carregar o alerta."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAlert();
  }, [id]);

  if (loading) {
    return (
      <div className="table-state">
        Carregando alerta...
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="table-state error-state">
        {error ??
          "Alerta não encontrado."}
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/alerts"
        className="back-link"
      >
        <ArrowLeft size={15} />

        Voltar para alertas
      </Link>

      <div className="page-heading alert-details-heading">
        <div>
          <span className="page-kicker">
            Investigation
          </span>

          <h1>
            {alert.rule}
          </h1>

          <p>
            Detalhes da detecção gerada
            pelo SENTINEL.
          </p>
        </div>

        <span
          className={`severity severity-${alert.severity.toLowerCase()}`}
        >
          {alert.severity}
        </span>
      </div>

      <div className="details-grid">
        <section className="panel details-main">
          <div className="panel-header">
            <div>
              <h2>
                Informações da detecção
              </h2>

              <p>
                Dados produzidos pelo
                Rules Engine.
              </p>
            </div>
          </div>

          <div className="details-content">
            <div className="detail-block">
              <span>
                Motivo
              </span>

              <p>
                {alert.reason}
              </p>
            </div>

            <div className="detail-block">
              <span>
                Regra acionada
              </span>

              <strong>
                {alert.rule}
              </strong>
            </div>

            <div className="detail-block">
              <span>
                Severidade
              </span>

              <strong>
                {alert.severity}
              </strong>
            </div>
          </div>
        </section>

        <aside className="details-side">
          <div className="detail-card">
            <ShieldAlert size={18} />

            <div>
              <span>
                Alert ID
              </span>

              <code>
                {alert.id}
              </code>
            </div>
          </div>

          <div className="detail-card">
            <Fingerprint size={18} />

            <div>
              <span>
                Event ID
              </span>

              <code>
                {alert.eventId}
              </code>
            </div>
          </div>

          <div className="detail-card">
            <Calendar size={18} />

            <div>
              <span>
                Detectado em
              </span>

              <strong>
                {new Date(
                  alert.createdAt
                ).toLocaleString(
                  "pt-BR"
                )}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}