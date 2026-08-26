import type {
  FastifyInstance,
} from "fastify";

export async function healthRoutes(
  app: FastifyInstance
) {
  app.get(
    "/health",
    async () => {
      return {
        service:
          "sentinel-api",

        status:
          "healthy",

        timestamp:
          new Date().toISOString(),

        uptime:
          Math.floor(
            process.uptime()
          ),

        environment:
          process.env.NODE_ENV ??
          "development",

        version: "1.0.0",
      };
    }
  );
}