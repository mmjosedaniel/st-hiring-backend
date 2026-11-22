import { EventDAL } from "../dal/events.dal";
import { Request, Response } from "express";
import { TicketsDAL } from "../dal/tickets.dal";

export const createGetEventsController = ({
  eventsDAL,
  ticketsDAL,
}: {
  eventsDAL: EventDAL;
  ticketsDAL: TicketsDAL
}) => async (req: Request, res: Response) => {
  const { page: stringPage = '1', pageSize: stringPageSize = '10' } = req.query;
  
  const page = Number(stringPage);
  const pageSize = Number(stringPageSize);

  if (
    !Number.isSafeInteger(page) || page < 1 ||
    !Number.isSafeInteger(pageSize) || pageSize < 1 
  ) {
    res.status(400).json({
      message: 'page and pageSize must be positive integers.'
    })
    return
  }

  const [events, total] = await Promise.all([
    eventsDAL.getEvents(page, pageSize),
    eventsDAL.countEvents()
  ]);

  if (events.length === 0) {
    res.json({ items: [], total });
    return
  }

  // I propose adding a paginated GET /events/:eventId/tickets endpoint.
  // GET /events would return only event summaries. When a user opens an event's
  // details, the frontend would fetch the first page of available tickets for
  // that event and load additional pages on demand.

  const eventIds = events.map(event => event.id);

  const tickets = await ticketsDAL.getTicketsByEvent(eventIds);

  const eventsById = new Map(events.map(event => [event.id, event]))

  for (const event of events) {
    event.availableTickets = [];
  }
  
  for (const ticket of tickets) {
    const event = eventsById.get(ticket.event_id);
    event?.availableTickets.push(ticket);
  }
  
  res.json({items: events, total});
};
