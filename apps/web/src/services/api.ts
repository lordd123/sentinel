import type { SentinelEvent } from "../types/event";
import type { SentinelAlert } from "../types/alert";
import type { PaginatedResponse } from "../types/pagination";

import { apiFetch } from "./http";

// ========================================
// EVENTS
// ========================================

type GetEventsParams = {
  page?: number;
  limit?: number;
  severity?: string;
  source?: string;
  type?: string;
};

export async function getEvents(
  params: GetEventsParams = {}
) {
  const searchParams = new URLSearchParams();

  searchParams.set(
    "page",
    String(params.page ?? 1)
  );

  searchParams.set(
    "limit",
    String(params.limit ?? 10)
  );

  if (params.severity) {
    searchParams.set(
      "severity",
      params.severity
    );
  }

  if (params.source) {
    searchParams.set(
      "source",
      params.source
    );
  }

  if (params.type) {
    searchParams.set(
      "type",
      params.type
    );
  }

  const response = await apiFetch(
    `/events?${searchParams}`
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os eventos."
    );
  }

  return response.json() as Promise<
    PaginatedResponse<SentinelEvent>
  >;
}

// ========================================
// ALERTS
// ========================================

type GetAlertsParams = {
  page?: number;
  limit?: number;
  severity?: string;
  rule?: string;
};

export async function getAlerts(
  params: GetAlertsParams = {}
) {
  const searchParams = new URLSearchParams();

  searchParams.set(
    "page",
    String(params.page ?? 1)
  );

  searchParams.set(
    "limit",
    String(params.limit ?? 10)
  );

  if (params.severity) {
    searchParams.set(
      "severity",
      params.severity
    );
  }

  if (params.rule) {
    searchParams.set(
      "rule",
      params.rule
    );
  }

  const response = await apiFetch(
    `/alerts?${searchParams}`
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os alertas."
    );
  }

  return response.json() as Promise<
    PaginatedResponse<SentinelAlert>
  >;
}

// ========================================
// ALERT BY ID
// ========================================

export async function getAlertById(
  id: string
) {
  const response = await apiFetch(
    `/alerts/${id}`
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar o alerta."
    );
  }

  return response.json() as Promise<
    SentinelAlert
  >;
}