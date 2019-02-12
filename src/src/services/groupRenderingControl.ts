import { Service } from "./service";

export class GroupRenderingControl extends Service {
    constructor (host: string, port = 1400) {
        super("GroupRenderingControl", host, port, 
                "/MediaRenderer/GroupRenderingControl/Control",
                "/MediaRenderer/GroupRenderingControl/Event",
                "/xml/GroupRenderingControl1.xml");
    }
}