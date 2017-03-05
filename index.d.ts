
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
    seek: (seconds: number) => Promise<boolean>;
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
    getZoneInfo: () => Promise<ZoneInfo>;
    getZoneAttrs: () => Promise<ZoneAttributes>;
    getLEDState: () => Promise<boolean>;
    setLEDState: (setStateOn: boolean) => Promise<void>;
    getTopology: () => Promise<SonosTopology>;
    deviceDescription: () => Promise<any>;
    getMusicLibrary: (searchType: SonosSearchType, startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
    searchMusicLibrary: (searchType: SonosSearchType, searchTerm: string, startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
    getFavoritesRadioStations: (startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
    getFavoritesRadioShows: (startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
    getFavoritesRadio: (favoriteRadioType: any, startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
    getQueue: () => Promise<SearchMusicResult>;
    playTuneinRadio: (stationId: any, stationTitle: any) => Promise<boolean>;
    addSpotify: (trackId: any) => Promise<any>;
    playSpotifyRadio: (artistId: any, artistName: any) => Promise<boolean>;
    addSpotifyQueue: (trackId: any) => Promise<any>;
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
    constructor(position?: number, duration?: number, albumArtUrl?: string, albumArtUri?: string, uri?: string, title?: string, artist?: string, album?: string);
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
export declare class SearchMusicResult {
    returned: number;
    total: number;
    items: Array<Track>;
    constructor(returned: number, total: number, items: Array<Track>);
}
export declare class SonosTopology {
    zones: Array<SonosZone>;
    mediaServers: Array<SonosMediaServer>;
    constructor(zones?: Array<SonosZone>, mediaServers?: Array<SonosMediaServer>);
}
export declare class SonosZone {
    group: string;
    coordinator: boolean;
    wirelessMode: number;
    wirelessLeafOnly: number;
    hasConfiguredSSID: boolean;
    channelFreq: number;
    behindWifiExt: boolean;
    wifiEnabled: boolean;
    location: string;
    version: string;
    minCompatibleVersion: string;
    legacyCompatibleVersion: string;
    bootSeq: number;
    uuid: string;
    name: string;
    constructor(group?: string, coordinator?: boolean, wirelessMode?: number, wirelessLeafOnly?: number, hasConfiguredSSID?: boolean, channelFreq?: number, behindWifiExt?: boolean, wifiEnabled?: boolean, location?: string, version?: string, minCompatibleVersion?: string, legacyCompatibleVersion?: string, bootSeq?: number, uuid?: string, name?: string);
}
export declare class SonosMediaServer {
    location: string;
    uuid: string;
    version: string;
    canBeDisplayed: boolean;
    unavailable: boolean;
    type: number;
    ext: string;
    name: string;
    constructor(location?: string, uuid?: string, version?: string, canBeDisplayed?: boolean, unavailable?: boolean, type?: number, ext?: string, name?: string);
}
export declare enum SonosSearchType {
    artists = 0,
    albumArtists = 1,
    albums = 2,
    genres = 3,
    composers = 4,
    tracks = 5,
    playlists = 6,
    share = 7,
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
