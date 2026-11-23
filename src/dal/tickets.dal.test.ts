import { Knex } from "knex";
import { createTicketDAL } from "./tickets.dal";

describe("createTicketDAL", () => {
        describe("getTicketsByEvent", () => {
            it("should query tickets for all requested event IDs", async () => {
                const eventIds = [11, 12, 13];

                const rows = [
                    { id: 101, event_id: 11, status: 'available' },
                    { id: 301, event_id: 13, status: 'available' },
                ];

                const query = {
                    select: jest.fn().mockReturnThis(),
                    whereIn: jest.fn().mockReturnThis(),
                    where: jest.fn().mockResolvedValue(rows)
                }

                const mockKnex = jest.fn().mockReturnValue(query);
                const ticketsDAL = createTicketDAL(mockKnex as unknown as Knex);

                const result = await ticketsDAL.getTicketsByEvent(eventIds);

                expect(mockKnex).toHaveBeenCalledWith('tickets');
                expect(query.whereIn).toHaveBeenCalledWith('event_id', eventIds);
                expect(query.where).toHaveBeenCalledWith('status', 'available');
                expect(result).toEqual(rows);
            })
        })
    })
    