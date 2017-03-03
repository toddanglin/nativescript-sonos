import { Service } from "./service";
export declare class ZoneGroupTopology extends Service {
    constructor(host: string, port?: number);
    checkForUpdate: (options: any) => Promise<any>;
    beginSoftwareUpdate: (options: any) => Promise<any>;
    reportUnresponsiveDevice: (options: any) => Promise<any>;
    reportAlarmStartedRunning: (options: any) => Promise<any>;
    submitDiagnostics: (options: any) => Promise<any>;
    registerMobileDevice: (options: any) => Promise<any>;
    getZoneGroupAttributes: (options: any) => Promise<any>;
}
