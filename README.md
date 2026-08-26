# 🛡️ SENTINEL

### Security Operations & Threat Detection Platform

O **SENTINEL** é uma plataforma Full-Stack de monitoramento, processamento e detecção de eventos de segurança, desenvolvida com foco em conceitos de **Blue Team, SOC, DevSecOps e arquiteturas orientadas a eventos**.

A plataforma recebe eventos de segurança, realiza persistência e processamento assíncrono, executa regras de detecção, gera alertas e atualiza o dashboard em tempo real.

---

## 🚀 Visão Geral

O SENTINEL foi desenvolvido para simular componentes encontrados em plataformas de monitoramento e operações de segurança.

O fluxo principal funciona da seguinte maneira:

```text
Evento
  ↓
Fastify API
  ↓
PostgreSQL
  ↓
RabbitMQ
  ↓
Worker
  ↓
Rules Engine
  ↓
Redis
  ↓
Alert
  ↓
PostgreSQL
  ↓
Internal API
  ↓
WebSocket
  ↓
React Dashboard
```

A arquitetura separa a API responsável pela ingestão e consulta do processamento das regras de segurança, executadas por um **Worker independente**.

---

# ✨ Funcionalidades

## 🔐 Autenticação e autorização

- Cadastro de usuários
- Login com JWT
- Hash de senhas com bcrypt
- Rotas protegidas
- Role-Based Access Control (RBAC)
- Perfis ADMIN, ANALYST e VIEWER
- Proteção de recursos administrativos
- Gerenciamento de usuários por administrador

---

## 📡 Eventos de segurança

A plataforma permite receber, armazenar, consultar e processar eventos de segurança.

Recursos:

- Ingestão de eventos
- Validação de payload
- Persistência no PostgreSQL
- Paginação
- Filtros
- Consulta de eventos
- Processamento assíncrono
- Atualização em tempo real

---

## 🚨 Threat Detection

O SENTINEL possui um **Rules Engine** responsável pela análise dos eventos.

O mecanismo suporta:

- Regras simples
- Classificação por severidade
- Geração automática de alertas
- Regras baseadas em janela temporal
- Estado temporário utilizando Redis

Exemplo conceitual:

```text
LOGIN_FAILED
LOGIN_FAILED
LOGIN_FAILED
LOGIN_FAILED
LOGIN_FAILED
      ↓
Temporal Rule
      ↓
Suspicious Activity
      ↓
Alert
```

Isso permite identificar padrões que não seriam detectados analisando apenas um evento isolado.

---

## 🔔 Alertas

Quando uma regra é acionada:

```text
Rules Engine
     ↓
Alert criado
     ↓
PostgreSQL
     ↓
Internal Realtime API
     ↓
WebSocket
     ↓
Dashboard
```

Os alertas podem conter informações como:

- Regra acionada
- Severidade
- Motivo
- Evento relacionado
- Data e horário

---

# ⚡ Realtime

O dashboard utiliza **WebSocket** para receber atualizações em tempo real.

Isso permite que novos eventos e alertas sejam apresentados sem necessidade de atualizar manualmente a página.

Fluxo:

```text
Worker
  ↓
Internal API
  ↓
WebSocket Server
  ↓
Connected Clients
  ↓
React Dashboard
```

---

# 👥 RBAC

O SENTINEL possui três níveis principais de acesso.

### ADMIN

Acesso administrativo completo.

Pode:

- acessar dashboard;
- visualizar eventos;
- visualizar alertas;
- acessar recursos administrativos;
- gerenciar usuários e permissões.

### ANALYST

Perfil destinado à investigação e análise.

Pode acessar recursos necessários para análise de eventos e alertas conforme as permissões configuradas.

### VIEWER

Perfil de visualização.

Possui acesso limitado aos recursos permitidos para consulta, sem privilégios administrativos.

---

# 🏗️ Arquitetura

```text
┌─────────────────────────────┐
│       React Frontend        │
│     Security Dashboard      │
└──────────────┬──────────────┘
               │
          HTTP / WebSocket
               │
               ▼
┌─────────────────────────────┐
│         Fastify API         │
│                             │
│ Authentication              │
│ RBAC                        │
│ Events                      │
│ Alerts                      │
│ Admin                       │
│ WebSocket                   │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
 PostgreSQL      RabbitMQ
                    │
                    ▼
             ┌──────────────┐
             │    Worker    │
             │              │
             │ Rules Engine │
             └──────┬───────┘
                    │
              ┌─────┴─────┐
              ▼           ▼
           Redis      PostgreSQL
```

---

# 🧰 Stack

## Backend

- Node.js
- TypeScript
- Fastify
- Zod
- JWT
- bcrypt
- Prisma
- PostgreSQL

## Processamento e infraestrutura

- RabbitMQ
- Redis
- Worker assíncrono
- Event-driven architecture

## Frontend

- React
- TypeScript
- Vite
- React Router
- Lucide React
- CSS

## Segurança

- JWT Authentication
- RBAC
- bcrypt
- Helmet
- Rate Limiting
- CORS restrito
- API interna autenticada
- Security Headers
- Input Validation

## Observabilidade

- Structured Logging
- Request ID
- Health Check
- Logs de requisições
- Status HTTP estruturados

## Testes

- Vitest
- Fastify Inject

---

# 📁 Estrutura do Projeto

```text
sentinel/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── events/
│   │   │   │   ├── alerts/
│   │   │   │   └── admin/
│   │   │   │
│   │   │   ├── routes/
│   │   │   ├── websocket/
│   │   │   ├── errors/
│   │   │   └── tests/
│   │   │
│   │   └── package.json
│   │
│   ├── worker/
│   │   ├── src/
│   │   │   ├── processors/
│   │   │   ├── rules/
│   │   │   └── alerts/
│   │   │
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── services/
│       │   └── types/
│       │
│       └── package.json
│
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── .gitignore
└── README.md
```

---

# 🔄 Processamento de Eventos

Quando um evento é enviado para a plataforma:

### 1. Ingestão

```text
POST /events
```

A API recebe e valida os dados.

### 2. Persistência

O evento é armazenado no PostgreSQL.

### 3. Mensageria

O evento é enviado para o RabbitMQ.

### 4. Processamento

O Worker consome a mensagem.

### 5. Detecção

O Rules Engine avalia o evento.

### 6. Estado temporal

Quando necessário, o Redis mantém informações utilizadas por regras baseadas em janela temporal.

### 7. Alerta

Caso uma regra seja acionada, um alerta é criado.

### 8. Realtime

A API recebe a notificação interna e transmite a atualização para os clientes conectados via WebSocket.

---

# 🔒 Segurança

O projeto aplica múltiplas camadas de proteção.

## Password Security

As senhas são armazenadas utilizando hash com **bcrypt**.

```text
Password
   ↓
bcrypt
   ↓
Password Hash
```

Nenhuma senha deve ser armazenada em texto puro.

---

## JWT

Após autenticação válida, a API fornece um token JWT.

```text
Login
  ↓
Credentials Validation
  ↓
JWT
  ↓
Protected Routes
```

---

## RBAC

Após autenticação:

```text
Request
   ↓
JWT Validation
   ↓
User Role
   ↓
Authorization
   ↓
Controller
```

Isso permite separar permissões de ADMIN, ANALYST e VIEWER.

---

## Rate Limiting

Endpoints são protegidos contra excesso de requisições.

O login possui limite mais restritivo para reduzir tentativas automatizadas de autenticação.

---

## Internal API

A comunicação interna entre Worker e API possui autenticação independente.

```text
Worker
   ↓
Internal API Key
   ↓
API
```

A chave é enviada através de header interno e nunca deve ser armazenada diretamente no código-fonte.

---

## HTTP Security

A API utiliza:

- Helmet
- CORS restrito
- Rate Limiting
- validação de entrada
- tratamento centralizado de erros
- autenticação e autorização

---

# 📊 Observabilidade

Cada requisição recebe um identificador único.

Exemplo:

```text
x-request-id: 550e8400-e29b-41d4-a716-446655440000
```

Os logs incluem informações como:

```text
requestId
method
url
statusCode
```

Isso facilita rastreamento e investigação de problemas.

---

# ❤️ Health Check

Endpoint:

```http
GET /health
```

Exemplo:

```json
{
  "service": "sentinel-api",
  "status": "healthy",
  "timestamp": "2026-08-25T20:00:00.000Z",
  "uptime": 120,
  "environment": "development",
  "version": "1.0.0"
}
```

---

# 🧪 Testes

Os testes automatizados utilizam **Vitest** e o recurso `inject()` do Fastify.

Para executar:

```bash
cd apps/api
npm test
```

Os testes cobrem funcionalidades essenciais da aplicação, incluindo:

- Health Check
- validação de eventos
- criação de eventos
- comportamento de endpoints da API

---

# ⚙️ Instalação

## Pré-requisitos

Antes de executar o projeto, tenha disponível:

- Node.js
- PostgreSQL
- RabbitMQ
- Redis

---

## 1. Clonar

```bash
git clone https://github.com/lordd123/sentinel.git
cd sentinel
```

---

## 2. Instalar API

```bash
cd apps/api
npm install
```

Configure:

```text
apps/api/.env
```

Exemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sentinel"

JWT_SECRET="CHANGE_ME"

INTERNAL_API_KEY="CHANGE_ME"

RABBITMQ_URL="amqp://guest:guest@localhost:5672"

NODE_ENV="development"
```

---

## 3. Instalar Worker

```bash
cd ../worker
npm install
```

Configure:

```text
apps/worker/.env
```

Exemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sentinel"

RABBITMQ_URL="amqp://guest:guest@localhost:5672"

REDIS_URL="redis://localhost:6379"

INTERNAL_API_KEY="CHANGE_ME"
```

A `INTERNAL_API_KEY` deve corresponder à chave configurada na API.

---

## 4. Instalar Frontend

```bash
cd ../web
npm install
```

---

# ▶️ Executando

Abra três terminais.

## Terminal 1 — API

```bash
cd apps/api
npx tsx --env-file=.env src/server.ts
```

API:

```text
http://localhost:3333
```

---

## Terminal 2 — Worker

```bash
cd apps/worker
npx tsx --env-file=.env src/worker.ts
```

---

## Terminal 3 — Frontend

```bash
cd apps/web
npm run dev
```

O Vite exibirá o endereço local do frontend no terminal.

---

# 🌐 Principais Endpoints

## Authentication

```text
POST /auth/register
POST /auth/login
```

## Events

```text
POST /events
GET  /events
```

## Alerts

```text
GET /alerts
GET /alerts/:id
```

## Admin

```text
GET /admin/users
```

Outras operações administrativas podem exigir role `ADMIN`.

## System

```text
GET /health
```

## Realtime

```text
WS /ws
```

---

# 🖥️ Dashboard

O frontend foi desenvolvido com foco em uma interface limpa para operações de segurança.

As principais áreas incluem:

```text
Dashboard
Eventos
Alertas
Administração
```

O dashboard recebe atualizações em tempo real através do WebSocket.

---

# 🧠 Conceitos aplicados

O projeto foi utilizado para aplicar conceitos de engenharia de software e segurança como:

- Event-Driven Architecture
- Message Queues
- Asynchronous Processing
- Authentication
- Authorization
- RBAC
- Secure Coding
- API Hardening
- Threat Detection
- Temporal Detection Rules
- Realtime Communication
- Structured Logging
- Security Monitoring
- Blue Team
- DevSecOps

---

# 🗺️ Possíveis evoluções

Algumas evoluções futuras possíveis:

- Docker e Docker Compose
- CI/CD
- métricas com Prometheus
- dashboards com Grafana
- refresh tokens
- auditoria administrativa
- gerenciamento dinâmico de regras
- notificações externas
- integração com fontes externas de eventos
- testes E2E
- maior cobertura de testes
- deploy completo em cloud

---

# ⚠️ Variáveis de Ambiente

Arquivos `.env` não devem ser enviados para o repositório.

O projeto utiliza `.env.example` como referência de configuração.

Nunca publique:

- senhas;
- JWT secrets;
- API keys;
- connection strings com credenciais reais;
- tokens.

---

# 🎯 Objetivo do Projeto

O SENTINEL foi desenvolvido como projeto prático de **engenharia de software + segurança defensiva**, demonstrando a integração entre desenvolvimento Full-Stack, processamento distribuído, mensageria, autenticação, autorização, hardening e detecção de eventos.

O projeto busca demonstrar competências aplicáveis a oportunidades nas áreas de:

- Backend Development
- Full-Stack Development
- Cyber Security / Blue Team
- Application Security
- DevSecOps
- Security Operations

---

# 👨‍💻 Autor

**Eduardo Silva**

Desenvolvedor Full-Stack | Cyber Security Blue Team | DevSecOps

GitHub:  
https://github.com/lordd123

Projeto:  
https://github.com/lordd123/sentinel

---

## 📌 Status

**SENTINEL 1.0 — MVP funcional**

Projeto desenvolvido para fins de estudo, portfólio e demonstração técnica.