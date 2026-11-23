import { Collection } from 'mongodb';
import type { Settings } from '../entity/settings';

export interface SettingsDAL {
    getSettings(): Promise<Settings | null>;
    saveSettings(settings: Settings): Promise<Settings>;
}

export type SettingsDocument = Settings & { _id: string };

const settingsId = 'app-settings';

export const createSettingsDAL = (
    collection: Pick<Collection<SettingsDocument>, 'findOne' | 'updateOne'>
): SettingsDAL =>  {
    return {
        async getSettings() {
            const document = await collection.findOne({ _id: settingsId });

            if (document === null) {
                return null
            }

            return  {
                eventsPerPage: document.eventsPerPage,
                timeZone: document.timeZone,
            }
        },

        async saveSettings({ eventsPerPage, timeZone }) {
            const settings = { eventsPerPage, timeZone }

            await collection.updateOne(
                { _id: settingsId },
                { $set: settings },
                { upsert: true }
            );

            return settings
        }
    }
}
