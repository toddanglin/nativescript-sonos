import { Service } from "./service";

export class MusicServices extends Service {
    constructor (host: string, port = 1400) {
        super("MusicServices", host, port, 
                "/MusicServices/Control",
                "/MusicServices/Event",
                "/xml/MusicServices1.xml");
    }

    public getSessionId = (options): Promise<any> => { return this.request('GetSessionId', options); }
    public listAvailableServices = (options): Promise<any> => { return this.request('ListAvailableServices', options); }
    public updateAvailableServices = (options): Promise<any> => { return this.request('UpdateAvailableServices', options); }
}