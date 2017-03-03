import { Service } from "./service";
export declare class AVTransport extends Service {
    constructor(host: string, port?: number);
    setAVTransportURI: (options: any) => Promise<any>;
    addURIToQueue: (options: any) => Promise<any>;
    addMultipleURIsToQueue: (options: any) => Promise<any>;
    reorderTracksInQueue: (options: any) => Promise<any>;
    removeTrackFromQueue: (options: any) => Promise<any>;
    removeTrackRangeFromQueue: (options: any) => Promise<any>;
    removeAllTracksFromQueue: (options: any) => Promise<any>;
    saveQueue: (options: any) => Promise<any>;
    backupQueue: (options: any) => Promise<any>;
    getMediaInfo: (options: any) => Promise<any>;
    getTransportInfo: (options: any) => Promise<any>;
    getPositionInfo: (options: any) => Promise<any>;
    getDeviceCapabilities: (options: any) => Promise<any>;
    getTransportSettings: (options: any) => Promise<any>;
    getCrossfadeMode: (options: any) => Promise<any>;
    stop: (options: any) => Promise<any>;
    play: (options: any) => Promise<any>;
    pause: (options: any) => Promise<any>;
    seek: (options: any) => Promise<any>;
    next: (options: any) => Promise<any>;
    nextProgrammedRadioTracks: (options: any) => Promise<any>;
    previous: (options: any) => Promise<any>;
    nextSection: (options: any) => Promise<any>;
    previousSection: (options: any) => Promise<any>;
    setPlayMode: (options: any) => Promise<any>;
    setCrossfadeMode: (options: any) => Promise<any>;
    notifyDeletedURI: (options: any) => Promise<any>;
    getCurrentTransportActions: (options: any) => Promise<any>;
    becomeCoordinatorOfStandaloneGroup: (options: any) => Promise<any>;
    delegateGroupCoordinationTo: (options: any) => Promise<any>;
    becomeGroupCoordinator: (options: any) => Promise<any>;
    becomeGroupCoordinatorAndSource: (options: any) => Promise<any>;
}
