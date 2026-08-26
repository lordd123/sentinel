import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildApp,
} from "../app";

describe("GET /health", () => {
  it("deve retornar status healthy", async () => {
    const app = buildApp();

    const response =
      await app.inject({
        method: "GET",
        url: "/health",
      });

    expect(
      response.statusCode
    ).toBe(200);

    const body =
      response.json();

    expect(
      body.status
    ).toBe("healthy");

    expect(
      body.service
    ).toBe("sentinel-api");

    expect(
      response.headers[
        "x-request-id"
      ]
    ).toBeTruthy();

    await app.close();
  });
});