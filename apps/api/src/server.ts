import { buildApp } from "./app";

const app = buildApp();

app.listen({
  port: 3333,
  host: "0.0.0.0",
}).then(() => {
  console.log("SENTINEL API rodando na porta 3333");
});