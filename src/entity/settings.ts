export interface Settings {
    eventsPerPage: number;
    timeZone: string;
}

export const defaultSettings: Settings = {
    eventsPerPage: 10,
    timeZone: 'America/Bogota',
}