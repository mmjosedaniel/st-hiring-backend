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
            getTicketsByEvent: jest.fn().mockResolvedValue([])
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
            getTicketsByEvent: jest.fn()
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
            getTicketsByEvent: jest.fn()
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
            getTicketsByEvent: jest.fn()
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
});
