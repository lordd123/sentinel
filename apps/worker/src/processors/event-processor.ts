import type { SentinelEvent } from "../event.types";

import {
  AlertsRepository,
} from "../alerts/alerts.repository";

import {
  evaluateEvent,
  evaluateLoginFailureWindow,
} from "../rules/rules-engine";

const alertsRepository =
  new AlertsRepository();

async function notifyAlertCreated(
  alert: unknown
) {
  const internalApiKey =
    process.env.INTERNAL_API_KEY;

  if (!internalApiKey) {
    throw new Error(
      "INTERNAL_API_KEY não configurada no Worker."
    );
  }

  const response = await fetch(
    "http://localhost:3333/internal/realtime/alert",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "x-internal-api-key":
          internalApiKey,
      },

      body: JSON.stringify(alert),
    }
  );

  if (!response.ok) {
    const responseBody =
      await response.text();

    throw new Error(
      `Falha ao notificar API sobre novo alerta. Status: ${response.status}. Resposta: ${responseBody}`
    );
  }
}

export async function processEvent(
  event: SentinelEvent
) {
  console.log(
    `[PROCESSOR] Processando evento ${event.eventId}`
  );

  // ========================================
  // REGRA TEMPORAL
  // ========================================

  const temporalRule =
    await evaluateLoginFailureWindow(
      event
    );

  if (temporalRule.matched) {
    const alert =
      await alertsRepository.create({
        eventId: event.eventId,

        rule:
          temporalRule.rule!,

        severity:
          temporalRule.alertSeverity!,

        reason:
          temporalRule.reason!,
      });

    await notifyAlertCreated(
      alert
    );

    console.log(
      "🚨 ALERTA TEMPORAL DETECTADO"
    );

    console.log(alert);

    return;
  }

  // ========================================
  // REGRA SIMPLES
  // ========================================

  const simpleRule =
    evaluateEvent(event);

  if (!simpleRule.matched) {
    console.log(
      `[PROCESSOR] Nenhuma regra encontrada para ${event.eventId}`
    );

    return;
  }

  const alert =
    await alertsRepository.create({
      eventId: event.eventId,

      rule:
        simpleRule.rule!,

      severity:
        simpleRule.alertSeverity!,

      reason:
        simpleRule.reason!,
    });

  await notifyAlertCreated(
    alert
  );

  console.log(
    "🚨 ALERTA DETECTADO"
  );

  console.log(alert);
}