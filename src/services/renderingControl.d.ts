import { Service } from "./service";
export declare class RenderingControl extends Service {
    constructor(host: string, port?: number);
    getVolume: (options: any) => Promise<any>;
    setVolume: (options: any) => Promise<any>;
}
