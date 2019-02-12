import { Service } from "./service";

export class GroupManagement extends Service {
    constructor (host: string, port = 1400) {
        super("GroupManagement", host, port, 
                "/GroupManagement/Control",
                "/GroupManagement/Event",
                "/xml/GroupManagement1.xml");
    }

    public addMember = (options): Promise<any> => { return this.request('AddMember', options); }
    public removeMember = (options): Promise<any> => { return this.request('RemoveMember', options); }
    public reportTrackBufferingResult = (options): Promise<any> => { return this.request('ReportTrackBufferingResult', options); }
}