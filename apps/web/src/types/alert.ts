export type SentinelAlert = {
  id: string;
  eventId: string;
  rule: string;
  severity:
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  reason: string;
  createdAt: string;
};