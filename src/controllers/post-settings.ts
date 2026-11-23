import { Request, Response } from 'express';
import { Settings } from '../entity/settings';

interface SettingsWriter {
    saveSettings(settings: Settings): Promise<Settings>;
}

export const createPostSettingsController = (
    { settingsDAL }: { settingsDAL: SettingsWriter }
) => {
    async function handlePostSettings(req: Request, res: Response) {
        const { eventsPerPage, timeZone } = req.body ?? {};

        const validPageSize = [10, 25, 50].includes(eventsPerPage);
        const validTimeZone = ['America/Bogota', 'America/New_York', 'UTC'].includes(timeZone);

        if (!validPageSize || !validTimeZone) {
            res.status(400).json({
                message: 'Invalid eventsPerPage or timeZone.'
            })
            return
        }

        const savedSettings = await settingsDAL.saveSettings({
            eventsPerPage,
            timeZone,
        });

        res.status(200).json(savedSettings);
    };

    return handlePostSettings
}
