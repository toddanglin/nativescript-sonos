import { Service } from "./service";
export declare class ContentDirectory extends Service {
    constructor(host: string, port?: number);
    browse: (options: any) => Promise<any>;
}
