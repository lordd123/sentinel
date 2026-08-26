import { db } from "../prisma/db";

export type CreateAlertInput = {
  eventId: string;
  rule: string;
  severity: "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
};

export class AlertsRepository {
  async create(data: CreateAlertInput) {
    return db.orm.public.Alert.create({
      eventId: data.eventId,
      rule: data.rule,
      severity: data.severity,
      reason: data.reason,
    });
  }
}