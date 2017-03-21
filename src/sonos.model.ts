export class Track {
    constructor(public position?: number,
                public duration?: number,
                public albumArtUrl?: string,
                public albumArtUri?: string,
                public uri?: string,
                public title?: string,
                public artist?: string,
                public album?: string){}
}

export class UriObject {
    constructor(public uri: string,
                public metadata: any){}
}

export class ZoneAttributes {
    constructor(public currentZoneName?: string,
                public currentIcon?: string,
                public currentConfiguration?: string){}
}

export class ZoneInfo {
    constructor(public serialNumber?: string,
                public softwareVersion?: string,
                public displaySoftwareVersion?: string,
                public hardwareVersion?: string,
                public ipAddress?: string,
                public macAddress?: string,
                public copyrightInfo?: string,
                public extraInfo?: any,
                public htAudioIn?: boolean,
                public flags?: boolean){}
}

export class SearchMusicResult {
    constructor(public returned: number,
                public total: number,
                public items: Array<Track>){}
}

export class SonosTopology {
    constructor(public zones?: Array<SonosZone>,
                public mediaServers?: Array<SonosMediaServer>){}
}

export class SonosZone {
    constructor(public group?: string,
                public coordinator?: boolean,
                public wirelessMode?: number,
                public wirelessLeafOnly?: number,
                public hasConfiguredSSID?: boolean,
                public channelFreq?: number,
                public behindWifiExt?: boolean,
                public wifiEnabled?: boolean,
                public location?: string,
                public version?: string,
                public minCompatibleVersion?: string,
                public legacyCompatibleVersion?: string,
                public bootSeq?: number,
                public uuid?: string,
                public name?: string,
                public configuration?: number,
                public icon?: string,
                public description?: SonosZoneDescription,
                public orientation?: number,
                public roomCalibrationState?: number,
                public secureRegState?: number){}
                
}

export class SonosZoneGroup {
    constructor(public coordinator?: string,
                public id?: string,
                public zoneMembers?: Array<SonosZone>){}
}

export class SonosZoneDescription {
    constructor(public deviceType?: string,
                public friendlyName?: string,
                public manufacturer?: string,
                public manufacturerURL?: string,
                public modelNumber?: string,
                public modelDescription?: string,
                public modelName?: string,
                public modelURL?: string,
                public softwareVersion?: string,
                public hardwareVersion?: string,
                public serialNum?: string,
                public UDN?: string,
                public iconList?: { icon: Array<{ id: Array<number>, mimetype: Array<string>, width: Array<number>, height: Array<number>, depth: Array<number>, url: Array<string> }>},
                public minCompatibleVersion?: string,
                public legacyCompatibleVersion?: string,
                public displayVersion?: string,
                public extraVersion?: string,
                public roomName?: string,
                public displayName?: string,
                public zoneType?: number,
                public feature1?: string,
                public feature2?: string,
                public feature3?: string,
                public variant?: number,
                public internalSpeakerSize?: number,
                public bassExtension?: number,
                public satGainOffset?: number,
                public memory?: number,
                public flash?: number,
                public flashRepartitioned?: number,
                public ampOnTime?: number){}
                
}

export class SonosMediaServer {
    constructor(public location?: string,
                public uuid?: string,
                public version?: string,
                public canBeDisplayed?: boolean,
                public unavailable?: boolean,
                public type?: number,
                public ext?: string,
                public name?: string){}
}

export enum SonosSearchType {
    artists,
    albumArtists,
    albums,
    genres,
    composers,
    tracks,
    playlists,
    share
}

export enum PlayModeEnum {
    NORMAL,
    REPEAT_ALL,
    SHUFFLE,
    SHUFFLE_NOREPEAT
}

export enum SonosState {
    STOPPED,
    PLAYING,
    PAUSED_PLAYBACK,
    TRANSITIONING,
    NO_MEDIA_PRESENT
}