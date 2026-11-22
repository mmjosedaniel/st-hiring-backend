import { SettingsDAL } from "../dal/settings.dal"
import { defaultSettings } from "../entity/settings"
import type { Request, Response } from 'express';

export const createGetSettingsController = ({settingsDAL}: {settingsDAL: SettingsDAL}) => {
    async function handleGetSettings(_req: Request, res: Response): Promise<void> {
        const savedSettings = await settingsDAL.getSettings();
        const { eventsPerPage, timeZone } = savedSettings ?? defaultSettings;
        res.json({ eventsPerPage, timeZone });
    }

    return handleGetSettings;
}