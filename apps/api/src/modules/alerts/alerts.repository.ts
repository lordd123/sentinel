import { db } from "../../prisma/db";
import type { ListAlertsQuery } from "./alerts.schema";

export class AlertsRepository {
  async findAll(query: ListAlertsQuery) {
    const {
      page,
      limit,
      severity,
      rule,
    } = query;

    const offset = (page - 1) * limit;

    let baseQuery = db.orm.public.Alert;

    if (severity) {
      baseQuery = baseQuery.where({
        severity,
      });
    }

    if (rule) {
      baseQuery = baseQuery.where({
        rule,
      });
    }

    const allFilteredAlerts =
      await baseQuery.all();

    const total =
      allFilteredAlerts.length;

    const alerts = await baseQuery
      .orderBy((alert) =>
        alert.createdAt.desc()
      )
      .offset(offset)
      .limit(limit)
      .all();

    const totalPages =
      Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      data: alerts,
    };
  }

  async findById(id: string) {
    return db.orm.public.Alert.first({
      id,
    });
  }
}