import { Service } from "./service";

export class DeviceProperties extends Service {
    constructor (host: string, port = 1400) {
        super("DeviceProperties", host, port, 
                "/DeviceProperties/Control",
                "/DeviceProperties/Event",
                "/xml/DeviceProperties1.xml");
    }

    public setLEDState = (options): Promise<any> => { return this.request('SetLEDState', options); }
    public getLEDState = (options): Promise<any> => { return this.request('GetLEDState', options); }
    public setInvisible = (options): Promise<any> => { return this.request('SetInvisible', options); }
    public getInvisible = (options): Promise<any> => { return this.request('GetInvisible', options); }
    public addBondedZones = (options): Promise<any> => { return this.request('AddBondedZones', options); }
    public removeBondedZones = (options): Promise<any> => { return this.request('RemoveBondedZones', options); }
    public createStereoPair = (options): Promise<any> => { return this.request('CreateStereoPair', options); }
    public separateStereoPair = (options): Promise<any> => { return this.request('SeparateStereoPair', options); }
    public setZoneAttributes = (options): Promise<any> => { return this.request('SetZoneAttributes', options); }
    public getZoneAttributes = (options): Promise<any> => { return this.request('GetZoneAttributes', options); }
    public getHouseholdID = (options): Promise<any> => { return this.request('GetHouseholdID', options); }
    public getZoneInfo = (options): Promise<any> => { return this.request('GetZoneInfo', options); }
    public setAutoplayLinkedZones = (options): Promise<any> => { return this.request('SetAutoplayLinkedZones', options); }
    public getAutoplayLinkedZones = (options): Promise<any> => { return this.request('GetAutoplayLinkedZones', options); }
    public setAutoplayRoomUUID = (options): Promise<any> => { return this.request('SetAutoplayRoomUUID', options); }
    public getAutoplayRoomUUID = (options): Promise<any> => { return this.request('GetAutoplayRoomUUID', options); }
    public setAutoplayVolume = (options): Promise<any> => { return this.request('SetAutoplayVolume', options); }
    public getAutoplayVolume = (options): Promise<any> => { return this.request('GetAutoplayVolume', options); }
    public importSetting = (options): Promise<any> => { return this.request('ImportSetting', options); }
    public setUseAutoplayVolume = (options): Promise<any> => { return this.request('SetUseAutoplayVolume', options); }
    public getUseAutoplayVolume = (options): Promise<any> => { return this.request('GetUseAutoplayVolume', options); }
    public addHTSatellite = (options): Promise<any> => { return this.request('AddHTSatellite', options); }
    public removeHTSatellite = (options): Promise<any> => { return this.request('RemoveHTSatellite', options); }
}