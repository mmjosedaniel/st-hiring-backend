import { Request, Response } from "express";
import { createGetEventsController } from "./get-events";

describe("createGetEventsController",  () => {
    it("should return the requested page and the total number of events", async () => {
        const event = { id: 6, name: "Jazz concert" };

        const createEventDalMock = {
            getEvents: jest.fn().mockResolvedValue([event]),
            countEvents: jest.fn().mockResolvedValue(6)
        };

        const createTicketDALMock = {
            getTicketsByEvent: jest.fn().mockResolvedValue([]),
        }

        const controller = createGetEventsController({
            eventsDAL: createEventDalMock,
            ticketsDAL: createTicketDALMock
        });

        const query: Request['query'] = {page: '2', pageSize: '5'}
        const req = { query } as Request

        const json = jest.fn();
        const res = { json } as unknown as Response;

        await controller(req, res);

        expect(createEventDalMock.getEvents).toHaveBeenCalledWith(2, 5)
        expect(json).toHaveBeenCalledWith({
            items: [{ id: 6, name: "Jazz concert", availableTickets: [] }],
            total: 6
        })
    })

    it("should use the default page and page size when query parameters are missing", async () => {
        const mockCreateEventDal = {
            getEvents: jest.fn().mockResolvedValue([]),
            countEvents: jest.fn().mockResolvedValue(0),
        };

        const mockCreateTicketDAL = {
            getTicketsByEvent: jest.fn(),
        }

        const controller = createGetEventsController({
            eventsDAL: mockCreateEventDal,
            ticketsDAL: mockCreateTicketDAL
        });

        const query: Request['query'] = {}
        const req = { query } as Request

        const res = { json: jest.fn() } as unknown as Response;

        await controller(req, res);

        expect(mockCreateEventDal.getEvents).toHaveBeenCalledWith(1, 10)
    })

    it("should respond 400 and skip getEvents when page is zero", async () => {
        const mockCreateEventDal = {
            getEvents: jest.fn().mockResolvedValue([]),
            countEvents: jest.fn().mockResolvedValue(0),
        };

        const mockCreateTicketDAL = {
            getTicketsByEvent: jest.fn(),
        }

        const controller = createGetEventsController({
            eventsDAL: mockCreateEventDal,
            ticketsDAL: mockCreateTicketDAL
        });

        const query: Request['query'] = {page: '0'}
        const req = { query } as Request

        const status = jest.fn().mockReturnThis();
        const res = { status , json: jest.fn() } as unknown as Response;
        

        await controller(req, res);

        expect(status).toHaveBeenCalledWith(400)
        expect(mockCreateEventDal.getEvents).not.toHaveBeenCalled();
    })

    it("should respond 400 and skip getEvents when pageSize is zero", async () => {
        const mockCreateEventDal = {
            getEvents: jest.fn().mockResolvedValue([]),
            countEvents: jest.fn().mockResolvedValue(0),
        };

        const mockCreateTicketDAL = {
            getTicketsByEvent: jest.fn(),
        }

        const controller = createGetEventsController({
            eventsDAL: mockCreateEventDal,
            ticketsDAL: mockCreateTicketDAL
        });

        const query: Request['query'] = { pageSize: '0'}
        const req = { query } as Request

        const status = jest.fn().mockReturnThis();
        const res = { status , json: jest.fn() } as unknown as Response;
        

        await controller(req, res);

        expect(status).toHaveBeenCalledWith(400)
        expect(mockCreateEventDal.getEvents).not.toHaveBeenCalled();
    })

    it("should load available tickets once and assign them to the correct events", async() => {
        const events = [{ id: 11 }, { id: 12 }, { id: 13 }]

        const ticket101 = {id: 101, event_id: 11, status: "available"}
        const ticket102 = {id: 102, event_id: 11, status: "available"}
        const ticket301 = {id: 301, event_id: 13, status: "available"}

        const eventsDAL = {
            getEvents: jest.fn().mockResolvedValue(events),
            countEvents: jest.fn().mockResolvedValue(8),
        };

        const ticketsDAL = {
            getTicketsByEvent: jest.fn().mockResolvedValue([
                ticket101,
                ticket301,
                ticket102,
            ]),
        };

        const controller = createGetEventsController({ eventsDAL, ticketsDAL });

        const query: Request["query"] = { page: "1", pageSize: "3" };
        const req = { query } as Request;
        const json = jest.fn();
        const res = { json } as unknown as Response;

        await controller(req, res);

        expect(ticketsDAL.getTicketsByEvent).toHaveBeenCalledTimes(1);
        expect(ticketsDAL.getTicketsByEvent).toHaveBeenCalledWith([11, 12, 13]);

        expect(json).toHaveBeenCalledWith({
            items: [
                { id: 11, availableTickets: [ticket101, ticket102] },
                { id: 12, availableTickets: [] },
                { id: 13, availableTickets: [ticket301] },
            ],
            total: 8,
        });
    })
});
