import {
  getAccessToken,
  logout,
} from "./auth";

const API_URL =
  "http://localhost:3333";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    getAccessToken();

  const headers =
    new Headers(
      options.headers
    );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );

  if (response.status === 401) {
    logout();

    if (
      window.location.pathname !==
      "/login"
    ) {
      window.location.href =
        "/login";
    }

    throw new Error(
      "SESSION_EXPIRED"
    );
  }

  return response;
}