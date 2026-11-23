import { createSettingsDAL } from './settings.dal';

describe("settingsDAL", () => {
    describe("getSettings", () => {
        it("should return the saved settings", async () => {
            const collection = {
                findOne: jest.fn().mockResolvedValue({
                    _id: 'app-settings',
                    eventsPerPage: 25,
                    timeZone: 'America/New_York',
                }),
                updateOne: jest.fn().mockResolvedValue({ acknowledged: true }),
            };

            const settingsDAL = createSettingsDAL(collection);

            const result = await settingsDAL.getSettings();

            expect(result).toEqual({
                eventsPerPage: 25,
                timeZone: 'America/New_York',
            });
        })
    })

    describe("saveSettings", () => {
        it("should create or update the app settings", async () => {
            const settings = {
                eventsPerPage: 25,
                timeZone: 'America/New_York',
            };

            const collection = {
                findOne: jest.fn(),
                updateOne: jest.fn().mockResolvedValue({ acknowledged: true })
            };

            const settingsDAL = createSettingsDAL(collection);

            const result = await settingsDAL.saveSettings(settings);

            expect(collection.updateOne).toHaveBeenCalledWith(
                { _id: 'app-settings' },
                { $set: settings },
                { upsert: true }
            )
            expect(result).toEqual(settings);
        })
    })
})
