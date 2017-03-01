export declare class Track {
    position: number;
    duration: number;
    albumArtUrl: string;
    albumArtUri: string;
    uri: string;
    title: string;
    artist: string;
    album: string;
    constructor(position: number, duration: number, albumArtUrl?: string, albumArtUri?: string, uri?: string, title?: string, artist?: string, album?: string);
}
export declare class UriObject {
    uri: string;
    metadata: any;
    constructor(uri: string, metadata: any);
}
export declare class ZoneAttributes {
    currentZoneName: string;
    currentIcon: string;
    currentConfiguration: string;
    constructor(currentZoneName?: string, currentIcon?: string, currentConfiguration?: string);
}
export declare class ZoneInfo {
    serialNumber: string;
    softwareVersion: string;
    displaySoftwareVersion: string;
    hardwareVersion: string;
    ipAddress: string;
    macAddress: string;
    copyrightInfo: string;
    extraInfo: any;
    htAudioIn: boolean;
    flags: boolean;
    constructor(serialNumber?: string, softwareVersion?: string, displaySoftwareVersion?: string, hardwareVersion?: string, ipAddress?: string, macAddress?: string, copyrightInfo?: string, extraInfo?: any, htAudioIn?: boolean, flags?: boolean);
}
export declare enum PlayModeEnum {
    NORMAL = 0,
    REPEAT_ALL = 1,
    SHUFFLE = 2,
    SHUFFLE_NOREPEAT = 3,
}
export declare enum SonosState {
    STOPPED = 0,
    PLAYING = 1,
    PAUSED_PLAYBACK = 2,
    TRANSITIONING = 3,
    NO_MEDIA_PRESENT = 4,
}
