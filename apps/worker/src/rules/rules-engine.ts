import type { SentinelEvent } from "../event.types";
import { redis } from "../redis/redis";

export type RuleResult = {
  matched: boolean;
  rule?: string;
  alertSeverity?: "MEDIUM" | "HIGH" | "CRITICAL";
  reason?: string;
};

export function evaluateEvent(
  event: SentinelEvent
): RuleResult {
  if (event.severity === "CRITICAL") {
    return {
      matched: true,
      rule: "CRITICAL_EVENT",
      alertSeverity: "CRITICAL",
      reason: "Evento recebido com severidade CRITICAL.",
    };
  }

  if (
    event.type === "LOGIN_FAILED" &&
    event.severity === "HIGH"
  ) {
    return {
      matched: true,
      rule: "HIGH_LOGIN_FAILURE",
      alertSeverity: "HIGH",
      reason:
        "Falha de login classificada com severidade HIGH.",
    };
  }

  return {
    matched: false,
  };
}

export async function evaluateLoginFailureWindow(
  event: SentinelEvent
): Promise<RuleResult> {
  if (event.type !== "LOGIN_FAILED") {
    return {
      matched: false,
    };
  }

  const key = `login_failures:${event.source}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 120);
  }

  if (count >= 5) {
    return {
      matched: true,
      rule: "MULTIPLE_LOGIN_FAILURES",
      alertSeverity: "HIGH",
      reason: `${count} falhas de login detectadas em até 2 minutos para ${event.source}.`,
    };
  }

  return {
    matched: false,
  };
}