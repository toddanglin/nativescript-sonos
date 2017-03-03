import { Service } from "./service";
export declare class GroupManagement extends Service {
    constructor(host: string, port?: number);
    addMember: (options: any) => Promise<any>;
    removeMember: (options: any) => Promise<any>;
    reportTrackBufferingResult: (options: any) => Promise<any>;
}
