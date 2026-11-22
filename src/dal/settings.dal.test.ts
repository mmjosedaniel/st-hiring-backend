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
            };

            const settingsDAL = createSettingsDAL(collection);

            const result = await settingsDAL.getSettings();

            expect(result).toEqual({
                eventsPerPage: 25,
                timeZone: 'America/New_York',
            });
        })
    })
})
