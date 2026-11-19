import { Request, Response } from "express";
import { createGetEventsController } from "./get-events";

describe("createGetEventsController",  () => {
    it("should pass page 2 and page size 5 to getEvents", async () => {
        const mockCreateEventDal = {
            getEvents: jest.fn().mockResolvedValue([])
        };

        const mockCreateTicketDAL = {
            getTicketsByEvent: jest.fn()
        }

        const controller = createGetEventsController({
            eventsDAL: mockCreateEventDal,
            ticketsDAL: mockCreateTicketDAL
        });

        const query: Request['query'] = {page: '2', pageSize: '5'}
        const req = { query } as Request

        const res = { json: jest.fn() } as unknown as Response;

        await controller(req, res);

        expect(mockCreateEventDal.getEvents).toHaveBeenCalledWith(2, 5)
    })

    it("should use the default page and page size when query parameters are missing", async () => {
        const mockCreateEventDal = {
            getEvents: jest.fn().mockResolvedValue([])
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
            getEvents: jest.fn().mockResolvedValue([])
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
            getEvents: jest.fn().mockResolvedValue([])
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
