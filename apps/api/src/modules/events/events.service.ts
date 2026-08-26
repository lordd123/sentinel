import type {
  CreateEventInput,
  ListEventsQuery,
} from "./events.schema";
import { EventsRepository } from "./events.repository";
import { publishEvent } from "../../queue/event-producer";
import { broadcast } from "../../websocket/websocket-manager";

const eventsRepository = new EventsRepository();

export class EventsService {
async create(eventData: CreateEventInput) {
  const event =
    await eventsRepository.create(eventData);

  await publishEvent({
    eventId: event.id,
    type: event.type,
    source: event.source,
    severity: event.severity,
    createdAt: event.createdAt,
  });

  broadcast("EVENT_CREATED", event);

  return event;
}
async findAll(query: ListEventsQuery) {
  return eventsRepository.findAll(query);
}

  async findById(id: string) {
    return eventsRepository.findById(id);
  }
  
}