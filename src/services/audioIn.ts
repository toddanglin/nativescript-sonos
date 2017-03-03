import { Service } from "./service";

export class AudioIn extends Service {
    constructor (host: string, port = 1400) {
        super("AudioIn", host, port, 
                "/AudioIn/Control",
                "/AudioIn/Event",
                "/xml/AudioIn1.xml");
    }

    public startTransmissionToGroup = (options): Promise<any> => { return this.request('StartTransmissionToGroup', options); }
    public stopTransmissionToGroup = (options): Promise<any> => { return this.request('StopTransmissionToGroup', options); }
    public setAudioInputAttributes = (options): Promise<any> => { return this.request('SetAudioInputAttributes', options); }
    public getAudioInputAttributes = (options): Promise<any> => { return this.request('GetAudioInputAttributes', options); }
    public setLineInLevel = (options): Promise<any> => { return this.request('SetLineInLevel', options); }
    public getLineInLevel = (options): Promise<any> => { return this.request('GetLineInLevel', options); }
    public selectAudio = (options): Promise<any> => { return this.request('SelectAudio', options); }
}