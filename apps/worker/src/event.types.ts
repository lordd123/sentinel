export type SentinelEvent = {
  eventId: string;
  type: string;
  source: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
};