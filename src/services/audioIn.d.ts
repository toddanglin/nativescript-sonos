import { Service } from "./service";
export declare class AudioIn extends Service {
    constructor(host: string, port?: number);
    startTransmissionToGroup: (options: any) => Promise<any>;
    stopTransmissionToGroup: (options: any) => Promise<any>;
    setAudioInputAttributes: (options: any) => Promise<any>;
    getAudioInputAttributes: (options: any) => Promise<any>;
    setLineInLevel: (options: any) => Promise<any>;
    getLineInLevel: (options: any) => Promise<any>;
    selectAudio: (options: any) => Promise<any>;
}
