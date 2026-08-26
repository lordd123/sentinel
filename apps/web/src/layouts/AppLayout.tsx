import type { ReactNode } from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  Bell,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

import {
  getCurrentUser,
  logout,
} from "../services/auth";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({
  children,
}: AppLayoutProps) {
  const navigate = useNavigate();

  const user =
    getCurrentUser();

  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "US";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>SENTINEL</strong>

            <span>
              Security Operations
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <LayoutDashboard
              size={18}
            />

            Dashboard
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <Activity size={18} />
            Eventos
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <Bell size={18} />
            Alertas
          </NavLink>


          {user?.role === "ADMIN" && (
  <NavLink
    to="/admin/users"
    className={({ isActive }) =>
      `nav-item ${
        isActive
          ? "active"
          : ""
      }`
    }
  >
    <Settings size={18} />
    Configurações
  </NavLink>
)}      
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot" />

            <div>
              <strong>
                Sistema operacional
              </strong>

              <span>
                Todos os serviços ativos
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              Security Operations Center
            </span>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />

              <input
                placeholder="Buscar no Sentinel..."
              />
            </div>

            <button
              className="icon-button"
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>

            <div className="user-area">
              <div className="user-info">
                <strong>
                  {user?.name ??
                    "Usuário"}
                </strong>

                <span>
                  {user?.role ??
                    "VIEWER"}
                </span>
              </div>

              <div className="avatar">
                {initials}
              </div>

              <button
                className="logout-button"
                onClick={
                  handleLogout
                }
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}