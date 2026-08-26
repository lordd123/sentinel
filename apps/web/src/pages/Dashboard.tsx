import {
  useEffect,
  useState,
} from "react";

import {
  getAlerts,
  getEvents,
} from "../services/api";

import {
  connectWebSocket,
  subscribeRealtime,
} from "../services/websocket";

import type { SentinelEvent } from "../types/event";
import type { SentinelAlert } from "../types/alert";

export function Dashboard() {
  const [events, setEvents] = useState<
    SentinelEvent[]
  >([]);

  const [alerts, setAlerts] = useState<
    SentinelAlert[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ========================================
  // Carregamento inicial do Dashboard
  // ========================================

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          eventsResponse,
          alertsResponse,
        ] = await Promise.all([
          getEvents(),
          getAlerts(),
        ]);

        setEvents(eventsResponse.data);
        setAlerts(alertsResponse.data);
      } catch (error) {
        console.error(error);

        setError(
          "Não foi possível carregar o dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // ========================================
  // Conexão WebSocket
  // ========================================

  useEffect(() => {
    connectWebSocket();

    const unsubscribe =
      subscribeRealtime((message) => {
  console.log(
    "Mensagem realtime:",
    message
  );

  if (message.type === "EVENT_CREATED") {
    const newEvent =
      message.payload as SentinelEvent;

    setEvents((currentEvents) => {
      const alreadyExists =
        currentEvents.some(
          (event) =>
            event.id === newEvent.id
        );

      if (alreadyExists) {
        return currentEvents;
      }

      return [
        newEvent,
        ...currentEvents,
      ].slice(0, 10);
    });
  }
});

    return () => {
      unsubscribe();
    };
  }, []);

  // ========================================
  // Estados da interface
  // ========================================

  if (loading) {
    return (
      <div className="table-state">
        Carregando SENTINEL...
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-state error-state">
        {error}
      </div>
    );
  }

  // ========================================
  // Interface
  // ========================================

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-kicker">
            Overview
          </span>

          <h1>Dashboard</h1>

          <p>
            Monitore eventos e alertas de
            segurança em tempo real.
          </p>
        </div>

        <button className="primary-button">
          Atualizar dados
        </button>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Eventos recentes</span>

          <strong>
            {events.length}
          </strong>

          <small>
            Últimos registros carregados
          </small>
        </article>

        <article className="stat-card">
          <span>Alertas ativos</span>

          <strong>
            {alerts.length}
          </strong>

          <small>
            Incidentes detectados
          </small>
        </article>

        <article className="stat-card">
          <span>Críticos</span>

          <strong>
            {
              alerts.filter(
                (alert) =>
                  alert.severity ===
                  "CRITICAL"
              ).length
            }
          </strong>

          <small>
            Requerem atenção imediata
          </small>
        </article>

        <article className="stat-card">
          <span>Status</span>

          <strong className="status-text">
            Operacional
          </strong>

          <small>
            API e processamento ativos
          </small>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Eventos recentes
              </h2>

              <p>
                Últimos eventos recebidos
                pela plataforma.
              </p>
            </div>
          </div>

          <div className="event-list">
            {events.map((event) => (
              <div
                className="event-row"
                key={event.id}
              >
                <div>
                  <strong>
                    {event.type}
                  </strong>

                  <span>
                    {event.source}
                  </span>
                </div>

                <span
                  className={`severity severity-${event.severity.toLowerCase()}`}
                >
                  {event.severity}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Alertas</h2>

              <p>
                Detecções recentes do
                Rules Engine.
              </p>
            </div>
          </div>

          <div className="alerts-list">
            {alerts.map((alert) => (
              <article
                className="alert-item"
                key={alert.id}
              >
                <div
                  className={`alert-indicator severity-${alert.severity.toLowerCase()}`}
                />

                <div>
                  <div className="alert-title">
                    <strong>
                      {alert.rule}
                    </strong>

                    <span
                      className={`severity severity-${alert.severity.toLowerCase()}`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p>
                    {alert.reason}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}