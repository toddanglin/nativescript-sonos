export declare class Service {
    private name;
    private host;
    private port;
    private controlURL;
    private eventSubURL;
    private SCPDURL;
    constructor(name: string, host: string, port: number, controlURL: string, eventSubURL: string, SCPDURL: string);
    request: (action: string, variables: any) => Promise<any>;
    private withinEnvelope;
}
