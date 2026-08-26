import { db } from "../../prisma/db";
import type {
  CreateEventInput,
  ListEventsQuery,
} from "./events.schema";

export class EventsRepository {
  async create(eventData: CreateEventInput) {
    const event = await db.orm.public.Event.create({
      type: eventData.type,
      source: eventData.source,
      severity: eventData.severity,
    });

    return event;
  }

async findAll(query: ListEventsQuery) {
  const {
    page,
    limit,
    severity,
    source,
    type,
  } = query;

  const offset = (page - 1) * limit;

  let baseQuery = db.orm.public.Event;

  if (severity) {
    baseQuery = baseQuery.where({
      severity,
    });
  }

  if (source) {
    baseQuery = baseQuery.where({
      source,
    });
  }

  if (type) {
    baseQuery = baseQuery.where({
      type,
    });
  }

  const allFilteredEvents = await baseQuery.all();

  const total = allFilteredEvents.length;

  const events = await baseQuery
    .orderBy((event) => event.createdAt.desc())
    .offset(offset)
    .limit(limit)
    .all();

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    data: events,
  };
}

  async findById(id: string) {
    const event = await db.orm.public.Event.first({
      id,
    });

    return event;
  }
}