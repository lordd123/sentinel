import type { ListAlertsQuery } from "./alerts.schema";
import { AlertsRepository } from "./alerts.repository";

const alertsRepository =
  new AlertsRepository();

export class AlertsService {
  async findAll(query: ListAlertsQuery) {
    return alertsRepository.findAll(query);
  }

  async findById(id: string) {
    return alertsRepository.findById(id);
  }
}