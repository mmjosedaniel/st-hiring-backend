import { Request, Response } from 'express';
import { createPostSettingsController } from './post-settings';

describe("createPostSettingsController", () => {
    it("should save valid settings and respond with the saved values", async () => {
        const settings = {
            eventsPerPage: 25,
            timeZone: 'America/New_York',
        };

        const settingsDAL = {
            saveSettings: jest.fn().mockResolvedValue(settings),
        };

        const controller = createPostSettingsController({ settingsDAL });

        const req = { body: settings } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller(req, res as unknown as Response);

        expect(settingsDAL.saveSettings).toHaveBeenCalledWith(settings);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(settings);
    })
} )
