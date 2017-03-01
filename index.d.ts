
export declare class Sonos {
    constructor(host: string, port?: number, options?: {});
    request: (endpoint: any, action: any, body: any, responseTag: any) => Promise<any>;
    currentTrack: () => Promise<Track>;
    getVolume: () => Promise<number>;
    getMuted: () => Promise<boolean>;
    play: (uri?: string | UriObject) => Promise<boolean>;
    stop: () => Promise<boolean>;
    pause: () => Promise<boolean>;
    flush: () => Promise<any>;
    becomeCoordinatorOfStandaloneGroup: () => Promise<boolean>;
    seek: (seconds: any, callback: any) => Promise<boolean>;
    next: () => Promise<boolean>;
    previous: () => Promise<boolean>;
    setName: (name: any) => Promise<any>;
    setPlayMode: (playmode: PlayModeEnum) => Promise<any>;
    setVolume: (volume: number) => Promise<any>;
    setMuted: (muted: boolean) => Promise<any>;
    selectTrack: (trackNr?: number) => Promise<boolean>;
    selectQueue: () => Promise<boolean>;
    queue: (uri: string | UriObject, positionInQueue?: number) => Promise<any>;
    getCurrentState: () => Promise<SonosState>;
    getZoneInfo: () => Promise<any>;
    getZoneAttrs: () => Promise<any>;
    deviceDescription: () => Promise<any>;
}

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

