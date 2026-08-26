import type {
  ReactNode,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AppLayout,
} from "./layouts/AppLayout";

import {
  Dashboard,
} from "./pages/Dashboard";

import {
  Events,
} from "./pages/Events";

import {
  Alerts,
} from "./pages/Alerts";

import {
  AlertDetails,
} from "./pages/AlertDetails";

import {
  Login,
} from "./pages/Login";

import {
  Forbidden,
} from "./pages/Forbidden";

import {
  isAuthenticated,
} from "./services/auth";

import {
  AdminUsers,
} from "./pages/AdminUsers";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function App() {
  const authenticated =
    isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}

        <Route
          path="/login"
          element={
            authenticated ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* EVENTS */}

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Events />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ALERTS */}

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Alerts />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AlertDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* SEM PERMISSÃO */}

        <Route
          path="/forbidden"
          element={
            <ProtectedRoute>
              <Forbidden />
            </ProtectedRoute>
          }
        />

        {/* HOME */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                authenticated
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />


        <Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <AppLayout>
        <AdminUsers />
      </AppLayout>
    </ProtectedRoute>
  }
/>

        {/* 404 / FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                authenticated
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;