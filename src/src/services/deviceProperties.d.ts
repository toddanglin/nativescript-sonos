import { Service } from "./service";
export declare class DeviceProperties extends Service {
    constructor(host: string, port?: number);
    setLEDState: (options: any) => Promise<any>;
    getLEDState: (options: any) => Promise<any>;
    setInvisible: (options: any) => Promise<any>;
    getInvisible: (options: any) => Promise<any>;
    addBondedZones: (options: any) => Promise<any>;
    removeBondedZones: (options: any) => Promise<any>;
    createStereoPair: (options: any) => Promise<any>;
    separateStereoPair: (options: any) => Promise<any>;
    setZoneAttributes: (options: any) => Promise<any>;
    getZoneAttributes: (options: any) => Promise<any>;
    getHouseholdID: (options: any) => Promise<any>;
    getZoneInfo: (options: any) => Promise<any>;
    setAutoplayLinkedZones: (options: any) => Promise<any>;
    getAutoplayLinkedZones: (options: any) => Promise<any>;
    setAutoplayRoomUUID: (options: any) => Promise<any>;
    getAutoplayRoomUUID: (options: any) => Promise<any>;
    setAutoplayVolume: (options: any) => Promise<any>;
    getAutoplayVolume: (options: any) => Promise<any>;
    importSetting: (options: any) => Promise<any>;
    setUseAutoplayVolume: (options: any) => Promise<any>;
    getUseAutoplayVolume: (options: any) => Promise<any>;
    addHTSatellite: (options: any) => Promise<any>;
    removeHTSatellite: (options: any) => Promise<any>;
}
