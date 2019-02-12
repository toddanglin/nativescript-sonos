import { Service } from "./service";

export class AlarmClock extends Service {
    constructor (host: string, port = 1400) {
        super("AlarmClock", host, port, 
                "/AlarmClock/Control",
                "/AlarmClock/Event",
                "/xml/AlarmClock1.xml");
    }

    public setFormat = (options): Promise<any> => { return this.request('SetFormat', options); }
    public getFormat = (options): Promise<any> => { return this.request('GetFormat', options); }
    public setTimeZone = (options): Promise<any> => { return this.request('SetTimeZone', options); }
    public getTimeZone = (options): Promise<any> => { return this.request('GetTimeZone', options); }
    public getTimeZoneAndRule = (options): Promise<any> => { return this.request('GetTimeZoneAndRule', options); }
    public getTimeZoneRule = (options): Promise<any> => { return this.request('GetTimeZoneRule', options); }
    public setTimeServer = (options): Promise<any> => { return this.request('SetTimeServer', options); }
    public getTimeServer = (options): Promise<any> => { return this.request('GetTimeServer', options); }
    public setTimeNow = (options): Promise<any> => { return this.request('SetTimeNow', options); }
    public getHouseholdTimeAtStamp = (options): Promise<any> => { return this.request('GetHouseholdTimeAtStamp', options); }
    public getTimeNow = (options): Promise<any> => { return this.request('GetTimeNow', options); }
    public createAlarm = (options): Promise<any> => { return this.request('CreateAlarm', options); }
    public updateAlarm = (options): Promise<any> => { return this.request('UpdateAlarm', options); }
    public destroyAlarm = (options): Promise<any> => { return this.request('DestroyAlarm', options); }
    public listAlarms = (options): Promise<any> => { return this.request('ListAlarms', options); }
    public setDailyIndexRefreshTime = (options): Promise<any> => { return this.request('SetDailyIndexRefreshTime', options); }
    public getDailyIndexRefreshTime = (options): Promise<any> => { return this.request('GetDailyIndexRefreshTime', options); }
}