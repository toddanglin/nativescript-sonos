let xml2js = require("nativescript-xml2js");
import { Track, UriObject, PlayModeEnum, SonosState, ZoneAttributes, ZoneInfo, SearchMusicResult } from "../sonos.model";
import * as trace from "trace";
import * as http from "http";
import * as _ from "underscore";

export class Service {
    private name: string;
    private host: string;
    private port: string;
    private controlURL: string;
    private eventSubURL: string;
    private SCPDURL: string;
    
    constructor(name: string, host: string, port = 1400, controlURL: string, eventSubURL: string, SCPDURL: string) {
        this.name = name;
        this.host = host;
        this.port = port.toString();
        this.controlURL = controlURL;
        this.eventSubURL = eventSubURL;
        this.SCPDURL = SCPDURL;
    }

    public request = (action: string, variables: any): Promise<any> => {
        let messageAction = `"urn:schemas-upnp-org:service:${this.name}:1#${action}"`;
        let messageBodyPre = `<u:${action} xmlns:u="urn:schemas-upnp-org:service:${this.name}:1">`;
        let messageBodyPost = `</u:${action}>`;
        let messageBody = `${messageBodyPre}${_.map(variables, (value, key) => { return `<${key}>${value}</${key}>`; }).join("")}${messageBodyPost}`;

        var responseTag = `u:${action}Response`;

        trace.write(`Sonos.request(${this.controlURL}, ${action}, ${messageBody}, ${responseTag})`, trace.categories.All, trace.messageType.info);

        return new Promise((resolve, reject) => {
            http.request({
                url: `http://${this.host}:${this.port}${this.controlURL}`,
                method: "POST",
                headers: {
                    'SOAPAction': messageAction,
                    'Content-type': 'text/xml; charset=utf8'
                },
                content: this.withinEnvelope(messageBody)
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

                    let returnVal = json["s:Envelope"]["s:Body"][0][responseTag][0];


                    // Remove unneeded metadata resopnse from final result
                    delete returnVal.$;

                    // "Unwrap" property values from XML response arrays
                    _.each(returnVal, (item, key) => {
                        returnVal[key] = item[0];
                    });

                    trace.write(`Sonos Request Return Value: ${JSON.stringify(returnVal)}`, trace.categories.All, trace.messageType.info);
                    resolve(returnVal);
                });
            })
            .catch((error) => {
                    reject(`Sonos Request Error: ${error}`);
            });
        });
    }

      /**
   * Helpers
   */

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
}

