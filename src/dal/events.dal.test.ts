import { Knex } from 'knex';
import { createEventDAL } from "./events.dal";

describe("createEventDAL", () => {
    describe("getEvents", () => {
        it("should query page 3 with a page size of 5", async () => {
            const rows = [{id: 11, name: "event 11"}];
            const query = {
                select: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockResolvedValue(rows),
            }

            const mockKnex = jest.fn().mockReturnValue(query);
            const eventsDAL = createEventDAL(mockKnex as unknown as Knex);

            const result = await eventsDAL.getEvents(3, 5);

            expect(mockKnex).toHaveBeenCalledWith('events');

            expect(query.orderBy).toHaveBeenCalledWith('id', 'asc');
            expect(query.limit).toHaveBeenCalledWith(5);
            expect(query.offset).toHaveBeenCalledWith(10);

            expect(result).toEqual(rows);
        })
    })

    describe("countEvents", () => {
        it("should count all events and return the total", async () => {
            const query = {
                count: jest.fn().mockResolvedValue([{ total: "6" }]),
            }
            
            const knexMock = jest.fn().mockReturnValue(query);
            const eventsDAL = createEventDAL(knexMock as unknown as Knex);

            const total = await eventsDAL.countEvents();

            expect(total).toBe(6);
        })
    })
})

