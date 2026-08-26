import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";

import { getEvents } from "../services/api";

import type { SentinelEvent } from "../types/event";

export function Events() {
  const [events, setEvents] = useState<
    SentinelEvent[]
  >([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] = useState(0);

  const [severity, setSeverity] =
    useState("");

  const [source, setSource] =
    useState("");

  const [type, setType] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadEvents() {
    try {
      setLoading(true);
      setError(null);

      const response = await getEvents({
        page,
        limit: 10,
        severity:
          severity || undefined,
        source:
          source || undefined,
        type:
          type || undefined,
      });

      setEvents(response.data);
      setTotal(response.total);
      setTotalPages(
        response.totalPages || 1
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível carregar os eventos."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [page, severity]);

  function applyFilters() {
    setPage(1);
    loadEvents();
  }

  function clearFilters() {
    setSeverity("");
    setSource("");
    setType("");
    setPage(1);
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-kicker">
            Monitoring
          </span>

          <h1>Eventos</h1>

          <p>
            Consulte, filtre e investigue
            os eventos recebidos pelo
            SENTINEL.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadEvents}
        >
          <RefreshCw size={15} />
          Atualizar
        </button>
      </div>

      <section className="filters-panel">
        <div className="filter-title">
          <Filter size={15} />
          Filtros
        </div>

        <div className="filters-grid">
          <div className="filter-field">
            <label>Tipo</label>

            <div className="input-with-icon">
              <Search size={15} />

              <input
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value
                  )
                }
                placeholder="LOGIN_FAILED..."
              />
            </div>
          </div>

          <div className="filter-field">
            <label>Origem</label>

            <input
              value={source}
              onChange={(event) =>
                setSource(
                  event.target.value
                )
              }
              placeholder="auth-service"
            />
          </div>

          <div className="filter-field">
            <label>Severidade</label>

            <select
              value={severity}
              onChange={(event) => {
                setSeverity(
                  event.target.value
                );
                setPage(1);
              }}
            >
              <option value="">
                Todas
              </option>

              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

              <option value="CRITICAL">
                CRITICAL
              </option>
            </select>
          </div>

          <div className="filter-actions">
            <button
              className="primary-button"
              onClick={applyFilters}
            >
              Aplicar
            </button>

            <button
              className="ghost-button"
              onClick={clearFilters}
            >
              Limpar
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header table-header">
          <div>
            <h2>Eventos recebidos</h2>

            <p>
              {total} registro(s)
              encontrados.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="table-state">
            Carregando eventos...
          </div>
        ) : error ? (
          <div className="table-state error-state">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="table-state">
            Nenhum evento encontrado.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Origem</th>
                  <th>Severidade</th>
                  <th>Data</th>
                  <th>ID</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>
                        {event.type}
                      </strong>
                    </td>

                    <td>
                      {event.source}
                    </td>

                    <td>
                      <span
                        className={`severity severity-${event.severity.toLowerCase()}`}
                      >
                        {event.severity}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        event.createdAt
                      ).toLocaleString(
                        "pt-BR"
                      )}
                    </td>

                    <td>
                      <code className="event-id">
                        {event.id.slice(
                          0,
                          8
                        )}
                        ...
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <span>
            Página {page} de{" "}
            {totalPages}
          </span>

          <div>
            <button
              className="pagination-button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) =>
                  current - 1
                )
              }
            >
              <ChevronLeft
                size={16}
              />
            </button>

            <button
              className="pagination-button"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage((current) =>
                  current + 1
                )
              }
            >
              <ChevronRight
                size={16}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}