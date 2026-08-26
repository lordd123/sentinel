import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getAlerts } from "../services/api";

import type { SentinelAlert } from "../types/alert";

export function Alerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<
    SentinelAlert[]
  >([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] = useState(0);

  const [severity, setSeverity] =
    useState("");

  const [rule, setRule] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadAlerts() {
    try {
      setLoading(true);
      setError(null);

      const response = await getAlerts({
        page,
        limit: 10,
        severity:
          severity || undefined,
        rule:
          rule || undefined,
      });

      setAlerts(response.data);
      setTotal(response.total);

      setTotalPages(
        response.totalPages || 1
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível carregar os alertas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, [page, severity]);

  function applyFilters() {
    setPage(1);
    loadAlerts();
  }

  function clearFilters() {
    setSeverity("");
    setRule("");
    setPage(1);
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="page-kicker">
            Detection
          </span>

          <h1>Alertas</h1>

          <p>
            Analise as detecções geradas
            pelo Rules Engine.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadAlerts}
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

        <div className="filters-grid alerts-filters">
          <div className="filter-field">
            <label>Regra</label>

            <input
              value={rule}
              onChange={(event) =>
                setRule(
                  event.target.value
                )
              }
              placeholder="HIGH_LOGIN_FAILURE"
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
            <h2>
              Alertas detectados
            </h2>

            <p>
              {total} alerta(s)
              encontrado(s).
            </p>
          </div>
        </div>

        {loading ? (
          <div className="table-state">
            Carregando alertas...
          </div>
        ) : error ? (
          <div className="table-state error-state">
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <div className="empty-alerts">
            <Bell size={24} />

            <strong>
              Nenhum alerta encontrado
            </strong>

            <span>
              O Rules Engine ainda não
              encontrou ocorrências para
              esses filtros.
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Regra</th>
                  <th>Severidade</th>
                  <th>Motivo</th>
                  <th>Data</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <strong>
                        {alert.rule}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`severity severity-${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td className="reason-cell">
                      {alert.reason}
                    </td>

                    <td>
                      {new Date(
                        alert.createdAt
                      ).toLocaleString(
                        "pt-BR"
                      )}
                    </td>

                    <td>
                      <button
                        className="table-action"
                        onClick={() =>
                          navigate(
                            `/alerts/${alert.id}`
                          )
                        }
                        title="Ver alerta"
                      >
                        <Eye size={15} />
                      </button>
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
              <ChevronLeft size={16} />
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
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}