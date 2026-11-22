import type { Settings } from '../entity/settings';

export interface SettingsDAL {
    getSettings(): Promise<Settings | null>
}
