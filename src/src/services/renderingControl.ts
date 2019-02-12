import { Service } from "./service";

export class RenderingControl extends Service {
    constructor (host: string, port = 1400) {
        super("RenderingControl", host, port, 
                "/MediaRenderer/RenderingControl/Control",
                "/MediaRenderer/RenderingControl/Event",
                "/xml/RenderingControl1.xml");
    }

    public getVolume = (options): Promise<any> => { return this.request('GetVolume', options); }
    public setVolume = (options): Promise<any> => { return this.request('SetVolume', options); }
}