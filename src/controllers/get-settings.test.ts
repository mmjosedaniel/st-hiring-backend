import type { Request, Response } from 'express';
import { createGetSettingsController } from './get-settings';

describe("createGetSettingsController", () => {
    it("should return default settings when no settings have been saved", async () => {
        const settingsDAL = {
            getSettings: jest.fn().mockResolvedValue(null)
        }

        const controller = createGetSettingsController({ settingsDAL });

        const req = {} as Request;
        const json = jest.fn();
        const res = { json } as unknown as Response;

        await controller(req, res);

        expect(settingsDAL.getSettings).toHaveBeenCalled();
        expect(json).toHaveBeenCalledWith({
            eventsPerPage: 10,
            timeZone: 'America/Bogota',
        });
    })

    it("should return saved settings when they exist", async () => {
        const savedSettings = {
            eventsPerPage: 25,
            timeZone: 'America/New_York',
        }

        const settingsDAL = {
            getSettings: jest.fn().mockResolvedValue(savedSettings),
        };

        const controller = createGetSettingsController({ settingsDAL });

        const req = {} as Request;
        const json = jest.fn();
        const res = { json } as unknown as Response;

        await controller(req, res);

        expect(json).toHaveBeenCalledWith(savedSettings);
    })
})