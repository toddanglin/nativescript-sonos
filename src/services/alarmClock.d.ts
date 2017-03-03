import { Service } from "./service";
export declare class AlarmClock extends Service {
    constructor(host: string, port?: number);
    setFormat: (options: any) => Promise<any>;
    getFormat: (options: any) => Promise<any>;
    setTimeZone: (options: any) => Promise<any>;
    getTimeZone: (options: any) => Promise<any>;
    getTimeZoneAndRule: (options: any) => Promise<any>;
    getTimeZoneRule: (options: any) => Promise<any>;
    setTimeServer: (options: any) => Promise<any>;
    getTimeServer: (options: any) => Promise<any>;
    setTimeNow: (options: any) => Promise<any>;
    getHouseholdTimeAtStamp: (options: any) => Promise<any>;
    getTimeNow: (options: any) => Promise<any>;
    createAlarm: (options: any) => Promise<any>;
    updateAlarm: (options: any) => Promise<any>;
    destroyAlarm: (options: any) => Promise<any>;
    listAlarms: (options: any) => Promise<any>;
    setDailyIndexRefreshTime: (options: any) => Promise<any>;
    getDailyIndexRefreshTime: (options: any) => Promise<any>;
}
