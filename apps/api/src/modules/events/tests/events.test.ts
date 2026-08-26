import { describe, expect, it } from "vitest";
import { buildApp } from "../../../app";

describe("Events API", () => {
  it("deve rejeitar um evento inválido", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/events",
      payload: {
        type: "",
        source: "",
        severity: "BATATA",
      },
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });
});

it("deve retornar health check", async () => {
  const app = buildApp();

  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.status).toBe("healthy");
  expect(body.service).toBe("sentinel-api");

  await app.close();
});

it("deve criar um evento válido", async () => {
  const app = buildApp();

  const response = await app.inject({
    method: "POST",
    url: "/events",
    payload: {
      type: "LOGIN_FAILED",
      source: "test-suite",
      severity: "HIGH",
    },
  });

  expect(response.statusCode).toBe(201);

  const body = response.json();

  expect(body.id).toBeDefined();
  expect(body.type).toBe("LOGIN_FAILED");
  expect(body.source).toBe("test-suite");
  expect(body.severity).toBe("HIGH");

  await app.close();
});