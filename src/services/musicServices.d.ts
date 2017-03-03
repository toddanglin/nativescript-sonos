import { Service } from "./service";
export declare class MusicServices extends Service {
    constructor(host: string, port?: number);
    getSessionId: (options: any) => Promise<any>;
    listAvailableServices: (options: any) => Promise<any>;
    updateAvailableServices: (options: any) => Promise<any>;
}
