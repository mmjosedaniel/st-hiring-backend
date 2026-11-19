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

  const events = await eventsDAL.getEvents(page, pageSize);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const tickets = await ticketsDAL.getTicketsByEvent(event.id);
    events[i].availableTickets = tickets.filter(ticket => ticket.status === 'available');
  }
  res.json(events);
};
