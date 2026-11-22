import { Collection } from 'mongodb';
import type { Settings } from '../entity/settings';

export interface SettingsDAL {
    getSettings(): Promise<Settings | null>
}

export type SettingsDocument = Settings & { _id: string };

export const createSettingsDAL = (
    collection: Pick<Collection<SettingsDocument>, 'findOne'>
): SettingsDAL =>  {
    return {
        async getSettings() {
            const document = await collection.findOne({ _id: 'app-settings' });

            if (document === null) {
                return null
            }

            return  {
                eventsPerPage: document.eventsPerPage,
                timeZone: document.timeZone,
            }
        }
    }
}
