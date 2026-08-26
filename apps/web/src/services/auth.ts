import type {
  AuthUser,
  LoginResponse,
} from "../types/auth";

const API_URL =
  "http://localhost:3333";

const TOKEN_KEY =
  "sentinel_access_token";

const USER_KEY =
  "sentinel_user";

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (response.status === 401) {
    throw new Error(
      "INVALID_CREDENTIALS"
    );
  }

  if (!response.ok) {
    throw new Error(
      "LOGIN_FAILED"
    );
  }

  const data =
    (await response.json()) as LoginResponse;

  localStorage.setItem(
    TOKEN_KEY,
    data.accessToken
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  );

  return data;
}

export function getAccessToken() {
  return localStorage.getItem(
    TOKEN_KEY
  );
}

export function getCurrentUser():
  AuthUser | null {
  const storedUser =
    localStorage.getItem(
      USER_KEY
    );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    ) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(
    getAccessToken()
  );
}

export function logout() {
  localStorage.removeItem(
    TOKEN_KEY
  );

  localStorage.removeItem(
    USER_KEY
  );
}