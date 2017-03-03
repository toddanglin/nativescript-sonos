let xml2js = require("nativescript-xml2js");
import { Track, UriObject, PlayModeEnum, SonosState, ZoneAttributes, ZoneInfo, SearchMusicResult, SonosTopology, SonosSearchType } from "./sonos.model";
import { ContentDirectory } from "./services/sonos-services";
import * as trace from "trace";
import * as http from "http";
import * as _ from "underscore";

/**
 * Sonos "Class"
 * @param {String} host IP/DNS
 * @param {Number} port Optional port (defaults to 1400)
 */
export class Sonos {

    /**
   * Constants
   */
    private TRANSPORT_ENDPOINT = "/MediaRenderer/AVTransport/Control";
    private RENDERING_ENDPOINT = "/MediaRenderer/RenderingControl/Control";
    private DEVICE_ENDPOINT = "/DeviceProperties/Control";

    private host: string;
    private port: number;
    private options: any;

    constructor(host: string, port = 1400, options = {}) {
        this.host = host;
        this.port = port;
        this.options = options;
        if (!this.options.endpoints) this.options.endpoints = {};
        if (!this.options.endpoints.transport) this.options.endpoints.transport = this.TRANSPORT_ENDPOINT;
        if (!this.options.endpoints.rendering) this.options.endpoints.rendering = this.RENDERING_ENDPOINT;
        if (!this.options.endpoints.device) this.options.endpoints.device = this.DEVICE_ENDPOINT;
    }

    /**
   * UPnP HTTP Request
   * @param  {String}   endpoint    Sonos HTTP Path
   * @param  {String}   action      UPnP Call/Function/Action
   * @param  {String}   body
   * @param  {String}   responseTag Expected Response Container XML Tag
   * @returns {Promise<any>} JSON response from Sonos
   */
    public request = (endpoint, action, body, responseTag): Promise<any> => {
        trace.write(`Sonos.request(${endpoint}, ${action}, ${body}, ${responseTag})`, trace.categories.All, trace.messageType.info);
        return new Promise((resolve, reject) => {
            http.request({
                method: "POST",
                headers: {
                    "SOAPAction": action,
                    "Content-type": "text/xml; charset=utf8"
                },
                url: `http://${this.host}:${this.port}${endpoint}`,
                timeout: 2000,
                content: this.withinEnvelope(body)
            })
                .then((result) => {
                    if (result.statusCode !== 200) {
                        throw new Error(`Sonos Request Error: Unexpected status code (${result.statusCode})`);
                    }

                    let strXML = result.content.toString();
                    xml2js.parseString(strXML, (error, json) => {
                        if (error) {
                            throw new Error(`Sonos XML Parse Error: ${error}`);
                        }

                        if ((!json) || (!json["s:Envelope"]) || (!Array.isArray(json["s:Envelope"]["s:Body"]))) {
                            throw new Error(`Invalid response for ${action}: ${JSON.stringify(json)}`)
                        }

                        if (typeof json["s:Envelope"]["s:Body"][0]["s:Fault"] !== "undefined") {
                            throw new Error(`Sonos Response Fault for ${action}: ${json["s:Envelope"]["s:Body"][0]["s:Fault"]}`);
                        }

                        let returnVal = json["s:Envelope"]["s:Body"][0][responseTag];
                        trace.write(`Sonos Request Return Value: ${returnVal}`, trace.categories.All, trace.messageType.info);
                        resolve(returnVal);
                    });
                })
                .catch((error) => {
                    reject(`Sonos Request Error: ${error}`);
                });
        });
    }

    /**
     * API
     */

    /**
 * Get Current Track
 ** @returns {Promise<Track>} Track object describing current track
 */
    public currentTrack = (): Promise<Track> => {
        return new Promise((resolve, reject) => {
            let action = '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"';
            let body = '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetPositionInfo>';
            let responseTag = "u:GetPositionInfoResponse";
            this.request(this.options.endpoints.transport, action, body, responseTag)
                .then((data) => {
                    if ((!Array.isArray(data)) || (data.length < 1)) {
                        resolve();
                        return;
                    }

                    trace.write(`Sonos currentTrack Result: ${JSON.stringify(data)}`, trace.categories.All, trace.messageType.info);

                    let metadata = data[0].TrackMetaData;
                    let position = (parseInt(data[0].RelTime[0].split(":")[0], 10) * 60 * 60) +
                        (parseInt(data[0].RelTime[0].split(":")[1], 10) * 60) +
                        parseInt(data[0].RelTime[0].split(":")[2], 10);
                    let duration = (parseInt(data[0].TrackDuration[0].split(":")[0], 10) * 60 * 60) +
                        (parseInt(data[0].TrackDuration[0].split(":")[1], 10) * 60) +
                        parseInt(data[0].TrackDuration[0].split(":")[2], 10);
                    let trackUri = data[0].TrackURI ? data[0].TrackURI[0] : null;

                    if ((metadata) && (metadata[0].length > 0) && metadata[0] !== "NOT_IMPLEMENTED") {
                        xml2js.parseString(metadata, (err, data) => {
                            if (err) {
                                throw new Error(`Error Parsing currentTrack XML: ${err}`);
                            }

                            let track = new Track(position, duration);
                            this.parseDIDL(track, data);

                            if (trackUri) track.uri = trackUri;

                            resolve(track);
                        })
                    } else {
                        let track = new Track(position, duration);
                        if (data[0].TrackURI) track.uri = data[0].TrackURI[0];
                        resolve(track);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Get Current Volume
     * @returns {Promise<number>} Current percent volume value between 0 and 100
     */
    public getVolume = (): Promise<number> => {
        let action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"';
        let body = '<u:GetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>';
        let responseTag = "u:GetVolumeResponse";

        return new Promise((resolve, reject) => {
            this.request(this.options.endpoints.rendering, action, body, responseTag)
                .then((data) => {
                    resolve(parseInt(data[0].CurrentVolume[0], 10));
                })
                .catch((err) => {
                    trace.write(`Sonos Volume Error: ${err}`, trace.categories.Error, trace.messageType.error);
                    reject(err);
                });
        });
    }

    /**
 * Get Current Muted
 * @returns {Promise<boolean>} True if player is Muted, False if player is unumted
 */
    public getMuted = (): Promise<boolean> => {
        let action = '"urn:schemas-upnp-org:service:RenderingControl:1#GetMute"';
        let body = '<u:GetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetMute>';
        let responseTag = "u:GetMuteResponse";

        return new Promise((resolve, reject) => {
            this.request(this.options.endpoints.rendering, action, body, responseTag)
                .then((data) => {
                    resolve(!!parseInt(data[0].CurrentMute[0], 10));
                })
                .catch((err) => {
                    trace.write(`Sonos Muted Error: ${err}`, trace.categories.Error, trace.messageType.error);
                    reject(err);
                });
        });
    }

    /**
 * Resumes Queue or Plays Provided URI
 * @param  {String|UriObject}   uri      Optional - URI to a Audio Stream or Object with play options
 * @returns {Promise<boolean>} True if play successful
 */
    public play = (uri?: string | UriObject): Promise<boolean> => {
        let action: string;
        let body: string;

        if (typeof uri === "string") {
            uri = this.optionsFromSpotifyUri(uri);
        }

        let options = <UriObject>(typeof uri === "object" ? uri : {});
        if (typeof uri === "object") {
            options.uri = uri.uri;
            options.metadata = uri.metadata;
        } else {
            options.uri = (typeof uri === "string" ? uri : undefined);
        }

        if (options.uri) {
            return new Promise((resolve, reject) => {
                this.queue(new UriObject(options.uri, options.metadata))
                    .then((queueResult) => {
                        if (!queueResult || queueResult.length < 0 || !queueResult[0].FirstTrackNumberEnqueued) {
                            resolve(false);
                        }

                        let selectTrackNum = queueResult[0].FirstTrackNumberEnqueued[0]
                        this.selectTrack(selectTrackNum)
                            .then((result) => {
                                return this.play();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        trace.write(`Sonos Play Queue Error: ${err}`, trace.categories.Error, trace.messageType.error);
                        reject(err);
                    });
            });
        } else {
            return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Play"',
                '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
                "u:PlayResponse");
        }
    }

    /**
 * Stop What's Playing
 * @returns {Promise<boolean>} True if stop successful
 */
    public stop = (): Promise<boolean> => {
        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Stop"',
            '<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Stop>',
            "u:StopResponse");
    }

    /**
 * Pause Current Queue
 * @returns {Promise<boolean>} True if pause successful
 */
    public pause = (): Promise<boolean> => {
        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Pause"',
            '<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Pause>',
            "u:PauseResponse");
    }

    /**
 * Flush queue
 * @returns {Promise<boolean>} True if flush all tracks from queue successful
 */
    public flush = (): Promise<any> => {
        return this.executeRequest('"urn:schemas-upnp-org:service:AVTransport:1#RemoveAllTracksFromQueue"',
            '<u:RemoveAllTracksFromQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:RemoveAllTracksFromQueue>',
            "u:RemoveAllTracksFromQueueResponse", this.options.endpoints.transport);
    }

    /**
 * Become Coordinator of Standalone Group
 * @returns {Promise<boolean>} True if operation successful
 */
    public becomeCoordinatorOfStandaloneGroup = (): Promise<boolean> => {
        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#BecomeCoordinatorOfStandaloneGroup"',
            '<u:BecomeCoordinatorOfStandaloneGroup xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:BecomeCoordinatorOfStandaloneGroup>',
            "u:BecomeCoordinatorOfStandaloneGroupResponse");
    }

    /**
     * Seek the current track
     * @param {number} seconds Number of seconds to seek in Track
     * @returns {Promise<boolean>} True if seek successful
     */
    public seek = (seconds: number): Promise<boolean> => {
        let hhStr, mmStr, ssStr: string;
        let hh = Math.floor(seconds / 3600);
        let mm = Math.floor((seconds - (hh * 3600)) / 60);
        let ss = seconds - ((hh * 3600) + (mm * 60));
        hhStr = (hh < 10) ? "0" + hh.toString() : hh.toString();
        mmStr = (mm < 10) ? "0" + mm.toString() : mm.toString();
        ssStr = (ss < 10) ? "0" + ss.toString() : ss.toString();

        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Seek"',
            `<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>REL_TIME</Unit><Target>${hhStr}:${mmStr}:${ssStr}</Target></u:Seek>`,
            "u:SeekResponse");
    }


    /**
     * Play next in queue
     * @returns {Promise<booelan>} True if movedToNext successful
     */
    public next = (): Promise<boolean> => {
        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Next"',
            '<u:Next xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Next>',
            "u:NextResponse");
    }

    /**
     * Play previous in queue
     * @returns {Promise<boolean>} True if movedToPrevious successful
     */
    public previous = (): Promise<boolean> => {
        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Previous"',
            '<u:Previous xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Previous>',
            "u:PreviousResponse");
    }

    /**
 * Set Name
 * @param  {String}   name New name for zone
 * @returns {Promise<any>} Response details
 */
    public setName = (name): Promise<any> => {
        name = name.replace(/[<&]/g, (str) => { return (str === "&") ? "&amp;" : "&lt;" });
        return this.executeRequest('"urn:schemas-upnp-org:service:DeviceProperties:1#SetZoneAttributes"',
            `"<u:SetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredZoneName>${name}</DesiredZoneName><DesiredIcon /><DesiredConfiguration /></u:SetZoneAttributes>"`,
            "u:SetZoneAttributesResponse", this.options.endpoints.device);
    }

    /**
     * Set Play Mode
     * @param  {PlayModeEnum} playmode Valid PlayModeEnum value
     * @returns {Promise<any>} Response details
     */
    public setPlayMode = (playmode: PlayModeEnum): Promise<any> => {
        return new Promise((resolve, reject) => {
            if (PlayModeEnum[playmode] === undefined) {
                return reject(`Invalid Play Mode: ${playmode}`);
            } else {
                return this.executeRequest('"urn:schemas-upnp-org:service:AVTransport:1#SetPlayMode"',
                    `<u:SetPlayMode xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><NewPlayMode>${PlayModeEnum[playmode]}</NewPlayMode></u:SetPlayMode>`,
                    "u:SetPlayModeResponse", this.options.endpoints.transport);
            }
        });
    }

    /**
     * Set Volume
     * @param  {String}   volume Volume percent between 0 and 100
     * @returns {Promise<any>} Response details
     */
    public setVolume = (volume: number): Promise<any> => {
        return this.executeRequest('"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"',
            `<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${volume}</DesiredVolume></u:SetVolume>`,
            "u:SetVolumeResponse", this.options.endpoints.rendering);
    }

    /**
     * Set Muted
     * @param  {Boolean} muted Mute with True, Unmute with False
     * @returns {Promise<any>} Reponse details (TODO: More detail needed)
     */
    public setMuted = (muted: boolean): Promise<any> => {
        return this.executeRequest('"urn:schemas-upnp-org:service:RenderingControl:1#SetMute"',
            `<u:SetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredMute>${muted ? 1 : 0}</DesiredMute></u:SetMute>`,
            "u:SetMutedResponse", this.options.endpoints.rendering);
    }

    /**
 * Select specific track in queue
 * @param  {Number}   trackNr    Number of track in queue (optional, indexed from 1)
 * @returns {Promise<booblean>} True if track select successful
 */
    public selectTrack = (trackNr = 1): Promise<boolean> => {
        return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#Seek"',
            `<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>${trackNr}</Target></u:Seek>`,
            "u:SeekResponse");
    }

    /**
 * Select Queue. Mostly required after turning on the speakers otherwise play, setPlaymode and other commands will fail.
 * @returns  {Promise<boolean>} True if selectQueue successful
 */
    public selectQueue = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this.getZoneInfo()
                .then((data) => {
                    return this.executeTransportRequest('"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"',
                        `<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-rincon-queue:RINCON_${data.macAddress.replace(/:/g, "")}0${this.port}#0</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>`,
                        "u:SetAVTransportURIResponse");
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Add a song to the queue.
     * @param  {string|UriObject}   uri   URI to Audio Stream
     * @param  {number}   positionInQueue Position in queue at which to add song (optional, indexed from 1,
     *                                    defaults to end of queue, 0 to explicitly set end of queue)
     * @returns {Promise<any>} queued
     */
    public queue = (uri: string | UriObject, positionInQueue = 0): Promise<any> => {
        return new Promise((resolve, reject) => {
            if (typeof uri === "string") {
                uri = this.optionsFromSpotifyUri(uri);
            }

            let options = <UriObject>(typeof uri === "object" ? uri : { metadata: "" });
            if (typeof uri === "object") {
                options.metadata = uri.metadata || "";
                options.metadata = this.htmlEntities(options.metadata);
                options.uri = uri.uri;
            } else {
                options.uri = uri;
            }

            let action = '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"';
            let body = `<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>${options.uri}</EnqueuedURI><EnqueuedURIMetaData>${options.metadata}</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>${positionInQueue}</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>`;
            this.request(this.options.endpoints.transport, action, body, "u:AddURIToQueueResponse")
                .then((data) => {
                    // console.log(`Sonos Queue Success: ${JSON.stringify(data)}`);
                    resolve(data);
                })
                .catch((err) => {
                    trace.write(`Sonos Queue Error: ${err}`, trace.categories.Error, trace.messageType.error);
                    reject(err);
                });
        });
    }

    /**
 * Get Current Playback State
 * @returns {Promise<SonosState>} Object representing current play state
 */
    public getCurrentState = (): Promise<SonosState> => {
        return new Promise((resolve, reject) => {
            this.executeRequest('"urn:schemas-upnp-org:service:AVTransport:1#GetTransportInfo"',
                '<u:GetTransportInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:GetTransportInfo>',
                "u:GetTransportInfoResponse", this.options.endpoints.transport)
                .then((data) => {
                    let currentState = JSON.stringify(data[0].CurrentTransportState);
                    if (currentState !== undefined) {
                        currentState = currentState.replace(/[\[\]"]/ig, "");
                    }
                    resolve(SonosState[currentState]);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    /**
 * Get Zone Info
 * @returns  {Promise<ZoneInfo>} ZoneInfo object describing player, including MAC and IP address
 */
    public getZoneInfo = (): Promise<ZoneInfo> => {
        return new Promise((resolve, reject) => {
            this.executeRequest('"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneInfo"',
                '<u:GetZoneInfo xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneInfo>',
                "u:GetZoneInfoResponse", this.options.endpoints.device)
                .then((data) => {
                    let output = new ZoneInfo();
                    for (let d in data[0]) {
                        if (data[0].hasOwnProperty(d) && d !== "$") {
                            let propName = d.charAt(0).toLowerCase() + d.slice(1);

                            // Handle some known edge cases
                            switch (propName) {
                                case "mACAddress":
                                    propName = "macAddress";
                                    break;
                                case "iPAddress":
                                    propName = "ipAddress";
                                    break;
                                case "hTAudioIn":
                                    propName = "htAudioIn";
                                    break;
                            }

                            output[propName] = data[0][d][0];
                        }
                    }
                    resolve(output);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Get Zone Attributes
     * @returns {Promise<ZoneAttributes>} ZoneAttributes object describing player, including Name
     */
    public getZoneAttrs = (): Promise<ZoneAttributes> => {
        return new Promise((resolve, reject) => {
            this.executeRequest('"urn:schemas-upnp-org:service:DeviceProperties:1#GetZoneAttributes"',
                '"<u:GetZoneAttributes xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetZoneAttributes>"',
                "u:GetZoneAttributesResponse", this.options.endpoints.device)
                .then((data) => {
                    let output = new ZoneAttributes();
                    for (let d in data[0]) {
                        if (data[0].hasOwnProperty(d) && d !== "$") {
                            let propName = d.charAt(0).toLowerCase() + d.slice(1);
                            output[propName] = data[0][d][0];
                        }
                    }
                    resolve(output);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Get the LED State
     * @returns  {Promise<boolean>} True for light "On", False for light "Off"
     */
    public getLEDState = (): Promise<boolean> => {
        let action = '"urn:schemas-upnp-org:service:DeviceProperties:1#GetLEDState"';
        let body = '<u:GetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"></u:GetLEDState>';

        return new Promise((resolve, reject) => {
            this.request(this.options.endpoints.device, action, body, 'u:GetLEDStateResponse')
                .then((data) => {
                    if (data[0] && data[0].CurrentLEDState && data[0].CurrentLEDState[0]) {
                        resolve((data[0].CurrentLEDState[0] === "On") ? true : false);
                    } else {
                        throw new Error("Unrecognized LED state response");
                    }
                })
                .catch((err) => {
                    let errMsg = `Sonos getLEDState Error: ${err}`;
                    trace.write(errMsg, trace.categories.Error, trace.messageType.error);
                    reject(errMsg);
                });
        });
    }

    /**
     * Set the LED State
     * @param  {boolean}   desiredState True to turn LED "On", False to turn LED "Off"
     * @returns  {Promise<void>} Resolves when request complete
     */
    public setLEDState = (setStateOn: boolean): Promise<void> => {
        let action = '"urn:schemas-upnp-org:service:DeviceProperties:1#SetLEDState"';
        let body = `<u:SetLEDState xmlns:u="urn:schemas-upnp-org:service:DeviceProperties:1"><DesiredLEDState>${(setStateOn ? "On" : "Off")}</DesiredLEDState></u:SetLEDState>`;

        return new Promise<void>((resolve, reject) => {
            this.request(this.options.endpoints.device, action, body, 'u:SetLEDStateResponse')
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    let errMsg = `Sonos setLEDState Error: ${err}`;
                    trace.write(errMsg, trace.categories.Error, trace.messageType.error);
                    reject(errMsg);
                });
        });
    }

    /**
     * Get Zones in contact with current Zone with Group Data
     * @returns {Promise<SonosTopology>} Object describing available zones and media servers
     */
    public getTopology = (): Promise<SonosTopology> => {
        return new Promise((resolve, reject) => {
            fetch(`http://${this.host}:${this.port}/status/topology`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Network error getting Sonos topology: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then((data) => {
                    xml2js.parseString(data, (error, topology) => {
                        if (error) {
                            throw new Error(`Error parsing Sonos topology XML: ${error}`);
                        }

                        let info = topology.ZPSupportInfo;
                        let zones = null;
                        let mediaServers = null;
                        if (info.ZonePlayers && info.ZonePlayers.length > 0) {
                            zones = _.map(info.ZonePlayers[0].ZonePlayer, function (zone) {
                                return _.extend(zone.$, { name: zone._ });
                            });
                        }
                        if (info.MediaServers && info.MediaServers.length > 0) {
                            mediaServers = _.map(info.MediaServers[0].MediaServer, function (zone) {
                                return _.extend(zone.$, { name: zone._ });
                            });
                        }

                        let result = new SonosTopology(zones, mediaServers);
                        resolve(result);
                    });
                })
                .catch((err) => {
                    let errMsg = `Sonos getTopology Error: ${err}`;
                    trace.write(errMsg, trace.categories.Error, trace.messageType.error);
                    reject(errMsg);
                });
        });
    }

    /**
     * Get Information provided by /xml/device_description.xml
     * @returns  {Promise<any>} Device details JSON from /xml/device_description.xml
     */
    public deviceDescription = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            http.request({
                method: "GET",
                url: `http://${this.host}:${this.port}/xml/device_description.xml`
            })
                .then((result) => {
                    if (result.statusCode !== 200) {
                        throw new Error(`Get Device Description Unexpected Status Code: ${result.statusCode}`);
                    }

                    xml2js.parseString(result.content.toString(), (err, json) => {
                        if (err) {
                            throw new Error(`Sonos Error Parsing Device Description XML: ${err}`);
                        }

                        let output = {};
                        for (let d in json.root.device[0]) {
                            if (json.root.device[0].hasOwnProperty(d)) {
                                output[d] = json.root.device[0][d][0];
                            }
                        }
                        resolve(output);
                    });
                })
                .catch((err) => {
                    trace.write(`Sonos deviceDescription Error: ${err}`, trace.categories.Error, trace.messageType.error);
                    reject(err);
                });
        });
    }

    /**
   * Get Music Library Information
   * @param  {SonosSearchType}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
   * @param  {Object}   options     Optional - default {start: 0, total: 100}
   * @returns  {Promise<SearchMusicResult>} result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
   */
    public getMusicLibrary = (searchType: SonosSearchType, startIndex = 0, pageSize = 100): Promise<SearchMusicResult> => {
        return this.searchMusicLibrary(searchType, null, startIndex, pageSize);
    }

    /**
 * Get Music Library Information
 * @param  {String}   searchType  Choice - artists, albumArtists, albums, genres, composers, tracks, playlists, share
 * @param  {String}   searchTerm  Optional - search term to search for
 * @param  {Object}   options     Optional - default {start: 0, total: 100}
 * @returns  {Promise<SearchMusicResult>} Contains number of items search returned, total match count and array of Track details
 */
    public searchMusicLibrary = (searchType: SonosSearchType, searchTerm: string, startIndex = 0, pageSize = 100): Promise<SearchMusicResult> => {
        let searchTypes = {
            "artists": "A:ARTIST",
            "albumArtists": "A:ALBUMARTIST",
            "albums": "A:ALBUM",
            "genres": "A:GENRE",
            "composers": "A:COMPOSER",
            "tracks": "A:TRACKS",
            "playlists": "A:PLAYLISTS",
            "sonos_playlists": "SQ:",
            "share": "S:"
        }

        let search = searchTypes[SonosSearchType[searchType]];

        // If no searchTerm, then perform "open search" within type
        let opensearch = (!searchTerm) || (searchTerm === "");
        if (!opensearch) {
            // Add searchTerm to selected searchType
            search = search.concat(":" + searchTerm);
        }

        let options = {
            start: startIndex,
            total: pageSize
        };

        return this.contentSearch(search, options, opensearch);
    }

    /**
     * Get Favorites Radio Stations
     * @param  {Object}   options     Optional - default {start: 0, total: 100}
     * @returns  {Promise<SearchMusicResult>} result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    public getFavoritesRadioStations = (startIndex = 0, pageSize = 100): Promise<SearchMusicResult> => {
        return this.getFavoritesRadio("stations", startIndex, pageSize);
    }
    /**
     * Get Favorites Radio Shows
     * @param  {Object}   options     Optional - default {start: 0, total: 100}
     * @returns  {Promise<SearchMusicResult>} result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    public getFavoritesRadioShows = (startIndex = 0, pageSize = 100): Promise<SearchMusicResult> => {
        return this.getFavoritesRadio("shows", startIndex, pageSize);
    }

    /**
     * Get Favorites Radio for a given radio type
     * @param  {String}   favoriteRadioType  Choice - stations, shows
     * @param  {Object}   options     Optional - default {start: 0, total: 100}
     * @returns  {Promise<SearchMusicResult>} result - {returned: {String}, total: {String}, items:[{title:{String}, uri: {String}}]}
     */
    public getFavoritesRadio = (favoriteRadioType, startIndex = 0, pageSize = 100): Promise<SearchMusicResult> => {
        let radioTypes = {
            "stations": "R:0/0",
            "shows": "R:0/1"
        }

        let options = {
            start: startIndex,
            total: pageSize
        };

        return this.contentSearch(radioTypes[favoriteRadioType], options);
    }

    // Get default queue
    public getQueue = (): Promise<SearchMusicResult> => {
        return this.contentSearch("Q:0", {});
    }

    /**
     * Plays tunein based on radio station id
     * @param  {String}   stationId  tunein radio station id
     * @returns  {Promise<boolean>} Playing
     */
    public playTuneinRadio = (stationId, stationTitle): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (!stationId || !stationTitle) {
                return reject("stationId and stationTitle are required");
            }

            let metadata = `<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" ` +
                            `xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">` +
                            `<item id="F00092020s${stationId} parentID="L" restricted="true"><dc:title>${stationTitle}</dc:title>` +
                            `<upnp:class>object.item.audioItem.audioBroadcast</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">` +
                            `SA_RINCON65031_</desc></item></DIDL-Lite>`;

            let action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"';
            let body = `<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID>`+
                        `<CurrentURI>x-sonosapi-stream:s${stationId}?sid=254&amp;flags=8224&amp;sn=0</CurrentURI>` +
                        `<CurrentURIMetaData>${this.htmlEntities(metadata)}</CurrentURIMetaData></u:SetAVTransportURI>`;

            this.request(this.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse')
                .then((data) => {
                    if (data[0].$['xmlns:u'] === 'urn:schemas-upnp-org:service:AVTransport:1') {
                        return this.play();
                    } else {
                        throw new Error(`Unable to play TuneIn Radio (Data: ${JSON.stringify(data)} )`);
                    }
                })
                .catch((err) => {
                    let errMsg = `Sonos playTuneinRadio Error: ${err}`;
                    trace.write(errMsg, trace.categories.Error, trace.messageType.error);
                    reject(errMsg);
                });
        });
    }

    /**
     * Add a song from spotify to the queue
     * @param  {String}   trackId      The spotify track ID
     * @returns {Promise<any>} Sucess
     */
    public addSpotify = (trackId): Promise<any> => {
        let uri = `x-sonos-spotify:spotify%3atrack%3a${trackId}`;
        let meta = `<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" ` +
                    `xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">` +
                    `<item id="00032020spotify%3atrack%3a${trackId}" restricted="true"><dc:title></dc:title>` +
                    `<upnp:class>object.item.audioItem.musicTrack</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">` +
                    `SA_RINCON3079_X_#Svc3079-0-Token</desc></item></DIDL-Lite>`;

        return this.queue({ uri: uri, metadata: meta });
    }

    /**
     * Plays Spotify radio based on artist uri
     * @param  {String}   artistId  Spotify artist id
     * @returns {Promise<boolean>} True if success playing
     */
    public playSpotifyRadio = (artistId, artistName): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (!artistId || !artistName) {
               return reject("artistId and artistName are required");
            }
            let options = this.optionsFromSpotifyUri(`spotify:artistRadio:${artistId}`, artistName)
            let action = '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"';
            let body = `<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID>` +
                        `<CurrentURI>x-sonosapi-radio:${options.uri}?sid=12&amp;flags=8300&amp;sn=1</CurrentURI>` +
                        `<CurrentURIMetaData>${this.htmlEntities(options.metadata)}</CurrentURIMetaData></u:SetAVTransportURI>`;

            this.request(this.options.endpoints.transport, action, body, 'u:SetAVTransportURIResponse')
                .then((data) => {
                    if (data[0].$["xmlns:u"] === "urn:schemas-upnp-org:service:AVTransport:1") {
                        return this.play()
                    } else {
                       throw new Error(`Unable to play Spotify Radio (Data: ${JSON.stringify(data)} )`);
                    }
                })
                .catch((err) => {
                    let errMsg = `Sonos playSpotifyRadio Error: ${err}`;
                    trace.write(errMsg, trace.categories.Error, trace.messageType.error);
                    reject(errMsg);
                });
        });
    }


    // Add Spotify track to the queue.
    public addSpotifyQueue = (trackId): Promise<any> => {
        let rand = "00030020";
        let uri = `x-sonos-spotify:spotify%3atrack%3a${trackId}`;
        let meta = `<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" ` +
                    `xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">` +
                    `<item id="${rand}spotify%3atrack%3a${trackId}" restricted="true"><dc:title></dc:title><upnp:class>` +
                    `object.item.audioItem.musicTrack</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">` +
                    `SA_RINCON2311_X_#Svc2311-0-Token</desc></item></DIDL-Lite>`;

        return this.queue({ uri: uri, metadata: meta });
    }


    /**
    * Helpers
    */
    private executeTransportRequest = (action: string, body: string, responseTag: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this.request(this.options.endpoints.transport, action, body, responseTag)
                .then((data) => {
                    // console.log("Sonos Transport Request Success: "+ JSON.stringify(data));
                    if (data[0].$["xmlns:u"] === "urn:schemas-upnp-org:service:AVTransport:1") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((err) => {
                    trace.write(`Sonos Transport Request Error: ${err} (ACTION: ${action}, BODY: ${body})`, trace.categories.Error, trace.messageType.error);
                    reject(err);
                });
        });
    }

    private executeRequest = (action: string, body: string, responseTag: string, endpoint: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.request(endpoint, action, body, responseTag)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    trace.write(`Sonos Request Error: ${err} (ACTION: ${action}, BODY: ${body})`, trace.categories.Error, trace.messageType.error);
                    reject(err);
                });
        });
    }

    private contentSearch = (searchObject: string, options: any, useResultContainer = false): Promise<SearchMusicResult> => {
        let defaultOptions = {
            BrowseFlag: "BrowseDirectChildren",
            Filter: "*",
            StartingIndex: "0",
            RequestedCount: "100",
            SortCriteria: ""
        }
        let opts = {
            ObjectID: searchObject
        }
        if (options.start !== undefined) opts["StartingIndex"] = options.start;
        if (options.total !== undefined) opts["RequestedCount"] = options.total;

        opts = _.extend(defaultOptions, opts);

        let contentDirectory = new ContentDirectory(this.host, this.port);

        return new Promise((resolve, reject) => {
            contentDirectory.browse(opts)
                .then((data) => {
                    xml2js.parseString(data.Result, (error, didl) => {
                        if (error) {
                            throw new Error(`Cannot parse contentSearch XML: ${error}`);
                        }
                        let items = new Array<Track>();

                        if ((!didl) || (!didl["DIDL-Lite"])) {
                            throw new Error(`Cannot parse DIDTL result: ${JSON.stringify(didl)}`);
                        }

                        let resultcontainer = useResultContainer ? didl["DIDL-Lite"].container : didl["DIDL-Lite"].item;
                        if (!Array.isArray(resultcontainer)) {
                            // Assume a missing container == empty results
                            return resolve(new SearchMusicResult(0, 0, new Array<Track>()));
                        }

                        resultcontainer.forEach((item) => {
                            let track = new Track();
                            track = this.parseDIDL(track, item, useResultContainer, true);
                            track.uri = Array.isArray(item.res) ? item.res[0]._ : null;

                            items.push(track);
                        })

                        let result = new SearchMusicResult(data.NumberReturned, data.TotalMatches, items);

                        resolve(result);
                    });
                })
                .catch((err) => {
                    let errMsg = `Sonos Search Music Library Error: ${err}`;
                    trace.write(errMsg, trace.categories.Error, trace.messageType.error);
                    reject(errMsg);
                });
        });
    }

    /**
     * Parse DIDL into track structure
     * @param  {String} didl
     * @returns {object}
     */
    private parseDIDL = (track: Track, didl: any, useContainer = false, skipDIDLChecks = false): Track => {
        let item: any;
        if (!skipDIDLChecks) {
            if ((!didl) || (!didl["DIDL-Lite"])) {
                return track;
            }

            if (useContainer) {
                if (!Array.isArray(didl["DIDL-Lite"].container) || !didl["DIDL-Lite"].container[0]) {
                    return track;
                }
            } else {
                if (!Array.isArray(didl["DIDL-Lite"].item) || !didl["DIDL-Lite"].item[0]) {
                    return track;
                }
            }

            item = useContainer ? didl["DIDL-Lite"].container[0] : didl["DIDL-Lite"].item[0];
        } else {
            item = didl;
        }

        track.title = Array.isArray(item["dc:title"]) ? item["dc:title"][0] : null;
        track.artist = Array.isArray(item["dc:creator"]) ? item["dc:creator"][0] : null;
        track.album = Array.isArray(item["upnp:album"]) ? item["upnp:album"][0] : null;
        track.albumArtUri = Array.isArray(item["upnp:albumArtURI"]) ? item["upnp:albumArtURI"][0] : null;

        track.albumArtUrl = !track.albumArtUri ? null
            : (track.albumArtUri.indexOf("http") === 0) ? track.albumArtUri
                : `http://${this.host}:${this.port}${track.albumArtUri}`;

        return track;
    }

    /**
     * Wrap in UPnP Envelope
     * @param  {String} body
     * @returns {String}
     */
    private withinEnvelope = (body) => {
        return ['<?xml version="1.0" encoding="utf-8"?>',
            '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
            '<s:Body>' + body + '</s:Body>',
            '</s:Envelope>'].join("");
    }

    /**
     * Encodes characters not allowed within html/xml tags
     * @param  {String} str
     * @returns {String}
     */
    private htmlEntities = (str) => {
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /**
     * Creates object with uri and metadata from Spotify track uri
     * @param  {String} uri
     * @returns {Object} options       {uri: Spotify uri, metadata: metadata}
     */
    private optionsFromSpotifyUri = (uri, title?) => {
        let spotifyIds = uri.split(":");
        if (Array.isArray(spotifyIds) && spotifyIds.length < 3) {
            return uri;
        }
        let spotifyUri = uri.replace(/:/g, "%3a");
        let meta = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="##SPOTIFYURI##" restricted="true"><dc:title>##RESOURCETITLE##</dc:title><upnp:class>##SPOTIFYTYPE##</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON3079_X_#Svc3079-0-Token</desc></item></DIDL-Lite>';
        if (uri.startsWith("spotify:track:")) {
            return {
                uri: spotifyUri,
                metadata: meta.replace("##SPOTIFYURI##", "00032020" + spotifyUri).replace("##RESOURCETITLE##", "").replace("##SPOTIFYTYPE##", "object.item.audioItem.musicTrack")
            }
        } else if (uri.startsWith("spotify:album:")) {
            return {
                uri: "x-rincon-cpcontainer:0004206c" + spotifyUri,
                metadata: meta.replace("##SPOTIFYURI##", "0004206c" + spotifyUri).replace("##RESOURCETITLE##", "").replace("##SPOTIFYTYPE##", "object.container.album.musicAlbum")
            }
        } else if (uri.startsWith("spotify:artistTopTracks:")) {
            return {
                uri: "x-rincon-cpcontainer:000e206c" + spotifyUri,
                metadata: meta.replace("##SPOTIFYURI##", "000e206c" + spotifyUri).replace("##RESOURCETITLE##", "").replace("##SPOTIFYTYPE##", "object.container.playlistContainer")
            }
        } else if (uri.startsWith("spotify:user:")) {
            return {
                uri: "x-rincon-cpcontainer:0006206c" + spotifyUri,
                metadata: meta.replace("##SPOTIFYURI##", "0006206c" + spotifyUri).replace("##RESOURCETITLE##", "").replace("##SPOTIFYTYPE##", "object.container.playlistContainer")
            }
        } else if (uri.startsWith("spotify:artistRadio:")) {
            let radioTitle = (title !== undefined) ? title : "Artist Radio";
            return {
                uri: spotifyUri,
                metadata: '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"><item id="000c206c' + spotifyUri + '" restricted="true"><dc:title>' + radioTitle + '</dc:title><upnp:class>object.item.audioItem.audioBroadcast.#artistRadio</upnp:class><desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON3079_X_#Svc3079-0-Token</desc></item></DIDL-Lite>'
            }
        } else {
            return uri;
        }
    }
}
