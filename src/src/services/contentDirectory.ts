import { Service } from "./service";

export class ContentDirectory extends Service {
    constructor (host: string, port = 1400) {
        super("ContentDirectory", host, port, 
                "/MediaServer/ContentDirectory/Control",
                "/MediaServer/ContentDirectory/Event",
                "/xml/ContentDirectory1.xml");
    }

    public browse = (options): Promise<any> => {
        return this.request("Browse", options);
    }
}