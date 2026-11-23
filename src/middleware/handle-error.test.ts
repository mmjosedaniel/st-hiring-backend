import { Request, Response } from 'express';
import { handleError } from "./handle-error";

describe("handleError", () => {
    it("should return 400 for invalid JSON", () => {
        const error = { status: 400, type: 'entity.parse.failed' };
        const req = {} as Request;
        const res = {
          headersSent: false,
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        handleError(error, req, res as unknown as Response, jest.fn());
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid JSON body' });
    })

    it("should return 500 with a generic message for an unexpected error", () => {
        const error = new Error('Database connection failed');
        const req = {} as Request;
        const res = {
            headersSent: false,
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        handleError(error, req, res as unknown as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    })
})