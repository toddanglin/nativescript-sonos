import { Service } from "./service";

export class AVTransport extends Service {
    constructor (host: string, port = 1400) {
        super("AVTransport", host, port, 
                "/MediaRenderer/AVTransport/Control",
                "/MediaRenderer/AVTransport/Event",
                "/xml/AVTransport1.xml");
    }

    public setAVTransportURI = (options): Promise<any> => { return this.request('SetAVTransportURI', options); }
    public addURIToQueue = (options): Promise<any> => { return this.request('AddURIToQueue', options); }
    public addMultipleURIsToQueue = (options): Promise<any> => { return this.request('AddMultipleURIsToQueue', options); }
    public reorderTracksInQueue = (options): Promise<any> => { return this.request('ReorderTracksInQueue', options); }
    public removeTrackFromQueue = (options): Promise<any> => { return this.request('RemoveTrackFromQueue', options); }
    public removeTrackRangeFromQueue = (options): Promise<any> => { return this.request('RemoveTrackRangeFromQueue', options); }
    public removeAllTracksFromQueue = (options): Promise<any> => { return this.request('RemoveAllTracksFromQueue', options); }
    public saveQueue = (options): Promise<any> => { return this.request('SaveQueue', options); }
    public backupQueue = (options): Promise<any> => { return this.request('BackupQueue', options); }
    public getMediaInfo = (options): Promise<any> => { return this.request('GetMediaInfo', options); }
    public getTransportInfo = (options): Promise<any> => { return this.request('GetTransportInfo', options); }
    public getPositionInfo = (options): Promise<any> => { return this.request('GetPositionInfo', options); }
    public getDeviceCapabilities = (options): Promise<any> => { return this.request('GetDeviceCapabilities', options); }
    public getTransportSettings = (options): Promise<any> => { return this.request('GetTransportSettings', options); }
    public getCrossfadeMode = (options): Promise<any> => { return this.request('GetCrossfadeMode', options); }
    public stop = (options): Promise<any> => { return this.request('Stop', options); }
    public play = (options): Promise<any> => { return this.request('Play', options); }
    public pause = (options): Promise<any> => { return this.request('Pause', options); }
    public seek = (options): Promise<any> => { return this.request('Seek', options); }
    public next = (options): Promise<any> => { return this.request('Next', options); }
    public nextProgrammedRadioTracks = (options): Promise<any> => { return this.request('NextProgrammedRadioTracks', options); }
    public previous = (options): Promise<any> => { return this.request('Previous', options); }
    public nextSection = (options): Promise<any> => { return this.request('NextSection', options); }
    public previousSection = (options): Promise<any> => { return this.request('PreviousSection', options); }
    public setPlayMode = (options): Promise<any> => { return this.request('SetPlayMode', options); }
    public setCrossfadeMode = (options): Promise<any> => { return this.request('SetCrossfadeMode', options); }
    public notifyDeletedURI = (options): Promise<any> => { return this.request('NotifyDeletedURI', options); }
    public getCurrentTransportActions = (options): Promise<any> => { return this.request('GetCurrentTransportActions', options); }
    public becomeCoordinatorOfStandaloneGroup = (options): Promise<any> => { return this.request('BecomeCoordinatorOfStandaloneGroup', options); }
    public delegateGroupCoordinationTo = (options): Promise<any> => { return this.request('DelegateGroupCoordinationTo', options); }
    public becomeGroupCoordinator = (options): Promise<any> => { return this.request('BecomeGroupCoordinator', options); }
    public becomeGroupCoordinatorAndSource = (options): Promise<any> => { return this.request('BecomeGroupCoordinatorAndSource', options); }
}