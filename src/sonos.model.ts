export class Track {
    constructor(public position: number,
                public duration: number,
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