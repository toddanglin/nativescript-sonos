export declare class Track {
    position?: number;
    duration?: number;
    albumArtUrl?: string;
    albumArtUri?: string;
    uri?: string;
    title?: string;
    artist?: string;
    album?: string;
    constructor(position?: number, duration?: number, albumArtUrl?: string, albumArtUri?: string, uri?: string, title?: string, artist?: string, album?: string);
}
export declare class UriObject {
    uri: string;
    metadata: any;
    constructor(uri: string, metadata: any);
}
export declare class ZoneAttributes {
    currentZoneName?: string;
    currentIcon?: string;
    currentConfiguration?: string;
    constructor(currentZoneName?: string, currentIcon?: string, currentConfiguration?: string);
}
export declare class ZoneInfo {
    serialNumber?: string;
    softwareVersion?: string;
    displaySoftwareVersion?: string;
    hardwareVersion?: string;
    ipAddress?: string;
    macAddress?: string;
    copyrightInfo?: string;
    extraInfo?: any;
    htAudioIn?: boolean;
    flags?: boolean;
    constructor(serialNumber?: string, softwareVersion?: string, displaySoftwareVersion?: string, hardwareVersion?: string, ipAddress?: string, macAddress?: string, copyrightInfo?: string, extraInfo?: any, htAudioIn?: boolean, flags?: boolean);
}
export declare class SearchMusicResult {
    returned: number;
    total: number;
    items: Array<Track>;
    constructor(returned: number, total: number, items: Array<Track>);
}
export declare class SonosTopology {
    zones?: Array<SonosZone>;
    mediaServers?: Array<SonosMediaServer>;
    constructor(zones?: Array<SonosZone>, mediaServers?: Array<SonosMediaServer>);
}
export declare class SonosZone {
    group?: string;
    coordinator?: boolean;
    wirelessMode?: number;
    wirelessLeafOnly?: number;
    hasConfiguredSSID?: boolean;
    channelFreq?: number;
    behindWifiExt?: boolean;
    wifiEnabled?: boolean;
    location?: string;
    version?: string;
    minCompatibleVersion?: string;
    legacyCompatibleVersion?: string;
    bootSeq?: number;
    uuid?: string;
    name?: string;
    configuration?: number;
    icon?: string;
    description?: SonosZoneDescription;
    orientation?: number;
    roomCalibrationState?: number;
    secureRegState?: number;
    constructor(group?: string, coordinator?: boolean, wirelessMode?: number, wirelessLeafOnly?: number, hasConfiguredSSID?: boolean, channelFreq?: number, behindWifiExt?: boolean, wifiEnabled?: boolean, location?: string, version?: string, minCompatibleVersion?: string, legacyCompatibleVersion?: string, bootSeq?: number, uuid?: string, name?: string, configuration?: number, icon?: string, description?: SonosZoneDescription, orientation?: number, roomCalibrationState?: number, secureRegState?: number);
}
export declare class SonosZoneGroup {
    coordinator?: string;
    id?: string;
    zoneMembers?: Array<SonosZone>;
    constructor(coordinator?: string, id?: string, zoneMembers?: Array<SonosZone>);
}
export declare class SonosZoneDescription {
    deviceType?: string;
    friendlyName?: string;
    manufacturer?: string;
    manufacturerURL?: string;
    modelNumber?: string;
    modelDescription?: string;
    modelName?: string;
    modelURL?: string;
    softwareVersion?: string;
    hardwareVersion?: string;
    serialNum?: string;
    UDN?: string;
    iconList?: {
        icon: Array<{
            id: Array<number>;
            mimetype: Array<string>;
            width: Array<number>;
            height: Array<number>;
            depth: Array<number>;
            url: Array<string>;
        }>;
    };
    minCompatibleVersion?: string;
    legacyCompatibleVersion?: string;
    displayVersion?: string;
    extraVersion?: string;
    roomName?: string;
    displayName?: string;
    zoneType?: number;
    feature1?: string;
    feature2?: string;
    feature3?: string;
    variant?: number;
    internalSpeakerSize?: number;
    bassExtension?: number;
    satGainOffset?: number;
    memory?: number;
    flash?: number;
    flashRepartitioned?: number;
    ampOnTime?: number;
    constructor(deviceType?: string, friendlyName?: string, manufacturer?: string, manufacturerURL?: string, modelNumber?: string, modelDescription?: string, modelName?: string, modelURL?: string, softwareVersion?: string, hardwareVersion?: string, serialNum?: string, UDN?: string, iconList?: {
        icon: Array<{
            id: Array<number>;
            mimetype: Array<string>;
            width: Array<number>;
            height: Array<number>;
            depth: Array<number>;
            url: Array<string>;
        }>;
    }, minCompatibleVersion?: string, legacyCompatibleVersion?: string, displayVersion?: string, extraVersion?: string, roomName?: string, displayName?: string, zoneType?: number, feature1?: string, feature2?: string, feature3?: string, variant?: number, internalSpeakerSize?: number, bassExtension?: number, satGainOffset?: number, memory?: number, flash?: number, flashRepartitioned?: number, ampOnTime?: number);
}
export declare class SonosMediaServer {
    location?: string;
    uuid?: string;
    version?: string;
    canBeDisplayed?: boolean;
    unavailable?: boolean;
    type?: number;
    ext?: string;
    name?: string;
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
    share = 7
}
export declare enum PlayModeEnum {
    NORMAL = 0,
    REPEAT_ALL = 1,
    SHUFFLE = 2,
    SHUFFLE_NOREPEAT = 3
}
export declare enum SonosState {
    STOPPED = 0,
    PLAYING = 1,
    PAUSED_PLAYBACK = 2,
    TRANSITIONING = 3,
    NO_MEDIA_PRESENT = 4
}
