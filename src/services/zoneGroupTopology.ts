import { Service } from "./service";

export class ZoneGroupTopology extends Service {
    constructor (host: string, port = 1400) {
        super("ZoneGroupTopology", host, port, 
                "/ZoneGroupTopology/Control",
                "/ZoneGroupTopology/Event",
                "/xml/ZoneGroupTopology1.xml");
    }

    public checkForUpdate = (options): Promise<any> => { return this.request('CheckForUpdate', options); }
    public beginSoftwareUpdate = (options): Promise<any> => { return this.request('BeginSoftwareUpdate', options); }
    public reportUnresponsiveDevice = (options): Promise<any> => { return this.request('ReportUnresponsiveDevice', options); }
    public reportAlarmStartedRunning = (options): Promise<any> => { return this.request('ReportAlarmStartedRunning', options); }
    public submitDiagnostics = (options): Promise<any> => { return this.request('SubmitDiagnostics', options); }
    public registerMobileDevice = (options): Promise<any> => { return this.request('RegisterMobileDevice', options); }
    public getZoneGroupAttributes = (options): Promise<any> => { return this.request('GetZoneGroupAttributes', options); }
}