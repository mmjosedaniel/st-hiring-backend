import { Knex } from 'knex';
import { Ticket } from '../entity/ticket';

export interface TicketsDAL {
  getTicketsByEvent(eventIds: number[]): Promise<Ticket[]>;
}

export const createTicketDAL = (knex: Knex): TicketsDAL => {
  return {
    async getTicketsByEvent(eventIds): Promise<Ticket[]> {
      return await knex<Ticket>('tickets')
        .select('*')
        .whereIn('event_id', eventIds)
        .where('status', 'available');
    },
  };
}
