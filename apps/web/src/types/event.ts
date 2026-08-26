export type SentinelEvent = {
  id: string;
  type: string;
  source: string;
  severity:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
  createdAt: string;
};