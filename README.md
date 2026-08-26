# SENTINEL

Plataforma full stack de monitoramento e detecção de eventos de segurança.

O SENTINEL recebe eventos, persiste dados, processa mensagens de forma assíncrona, aplica regras de detecção, gera alertas e atualiza o dashboard em tempo real.

## Arquitetura

```text
Frontend React
      │
      │ HTTP / WebSocket
      ▼
Fastify API
      │
      ├── PostgreSQL
      │
      └── RabbitMQ
             │
             ▼
           Worker
             │
             ├── Rules Engine
             ├── Redis
             └── PostgreSQL