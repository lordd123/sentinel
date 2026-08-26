import { FastifyReply, FastifyRequest } from "fastify";

import { EventsService } from "./events.service";
import {
  createEventSchema,
  listEventsQuerySchema,
  eventParamsSchema,
} from "./events.schema";

const eventsService = new EventsService();


// ========================================
// POST /events
// Cria um novo evento
// ========================================

export async function createEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation = createEventSchema.safeParse(request.body);

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_EVENT",
      message: "Os dados enviados são inválidos.",
      details: validation.error.issues,
    });
  }

  const event = await eventsService.create(validation.data);

  return reply.status(201).send(event);
}


// ========================================
// GET /events
// Busca todos os eventos
// ========================================

export async function listEventsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation = listEventsQuerySchema.safeParse(
    request.query
  );

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_QUERY",
      message: "Os filtros enviados são inválidos.",
      details: validation.error.issues,
    });
  }

  const result = await eventsService.findAll(
    validation.data
  );

  return reply.status(200).send(result);
}   

// ========================================
// GET /events/:id
// Busca um evento específico pelo ID
// ========================================

export async function getEventByIdController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validation = eventParamsSchema.safeParse(
    request.params
  );

  if (!validation.success) {
    return reply.status(400).send({
      error: "INVALID_EVENT_ID",
      message: "O ID informado é inválido.",
      details: validation.error.issues,
    });
  }

  const event = await eventsService.findById(
    validation.data.id
  );

  if (!event) {
    return reply.status(404).send({
      error: "EVENT_NOT_FOUND",
      message: "Evento não encontrado.",
    });
  }

  return reply.status(200).send(event);
}