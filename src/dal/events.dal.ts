import { Knex } from 'knex';
import { Event } from '../entity/event';

export interface EventDAL {
  getEvents(page: number, pageSize: number): Promise<Event[]>;
}

export const createEventDAL = (knex: Knex): EventDAL => {
  return {
    async getEvents(page, pageSize): Promise<Event[]> {
      const offset = (page -1) * pageSize;
      return await knex<Event>('events')
      .select('*')
      .orderBy('id', 'asc')
      .limit(pageSize)
      .offset(offset);
    },
  };
}
