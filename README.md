# NativeScript Sonos Plugin (WIP)
This plugin provides an interface for controlling a Sonos system on a local network from a NativeScript app. It is influenced heavily by the [NodeJS Sonos library](https://github.com/bencevans/node-sonos) created by [Ben Evans](https://github.com/bencevans).

**This is an incomplete, work-in-process plugin. Use accordingly.**

## Run the demo
After cloning this repo, navigate to the repo folder in your terminal and run this command:
```typescript
$ npm run demo.ios
```
This will build the lastest version of the plugin, add it to the demo project and launch the demo in the emulator.

**NOTE: The demo has only been tested for iOS, but the plugin should work on both iOS and Android.**

## How to use this plugin?
Add the plugin to a NativeScript application from the terminal:
```
$ tns plugin add nativescript-sonos
```
In your app, initialize the plugin with a valid Sonos IP address:
```typescript
import { Sonos } from "nativescript-sonos"

let sonos = new Sonos("10.0.1.188"); //Replace with your Sonos IP address
```
You can now call methods to control a Sonos player. Unlike the original NodeJS library, this plugin uses Promises for all async methods. For example, to Play:
```typescript
this.sonos.play()
  .then(() => {
    // Command to play completed successfully
  })
  .catch((err) => {
    // Something went wrong; handle the error state
  });
```
## Supported operations
This plugin does not yet support all of the methods from the [original NodeJS library](https://github.com/bencevans/node-sonos). Currently implemented methods are:

- currentTrack: () => Promise<Track>;
- selectTrack: (trackNr?: number) => Promise<boolean>;
- getVolume: () => Promise<number>;
- setVolume: (volume: number) => Promise<any>;
- getMuted: () => Promise<boolean>;
- setMuted: (muted: boolean) => Promise<any>;
- play: (uri?: string | UriObject) => Promise<boolean>;
- stop: () => Promise<boolean>;
- pause: () => Promise<boolean>;
- seek: (seconds: number) => Promise<boolean>;
- next: () => Promise<boolean>;
- previous: () => Promise<boolean>;
- flush: () => Promise<any>;
- becomeCoordinatorOfStandaloneGroup: () => Promise<boolean>;
- setName: (name: any) => Promise<any>;
- setPlayMode: (playmode: PlayModeEnum) => Promise<any>;
- selectQueue: () => Promise<boolean>;
- queue: (uri: string | UriObject, positionInQueue?: number) => Promise<any>;
- getCurrentState: () => Promise<SonosState>;
- getZoneInfo: () => Promise<ZoneInfo>;
- getZoneAttrs: () => Promise<ZoneAttributes>;
- getLEDState: () => Promise<boolean>;
- setLEDState: (setStateOn: boolean) => Promise<void>;
- getTopology: () => Promise<SonosTopology>;
- deviceDescription: () => Promise<any>;
- getQueue: () => Promise<SearchMusicResult>;
- getMusicLibrary: (searchType: SonosSearchType, startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
- searchMusicLibrary: (searchType: SonosSearchType, searchTerm: string, startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
- getFavoritesRadioStations: (startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
- getFavoritesRadioShows: (startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
- getFavoritesRadio: (favoriteRadioType: any, startIndex?: number, pageSize?: number) => Promise<SearchMusicResult>;
- playTuneinRadio: (stationId: any, stationTitle: any) => Promise<boolean>;
- addSpotify: (trackId: any) => Promise<any>;
- playSpotifyRadio: (artistId: any, artistName: any) => Promise<boolean>;
- addSpotifyQueue: (trackId: any) => Promise<any>;

## Sonos device discovery APIs
This plugin does not yet support the Discovery APIs (allowing you to automatially locate Sonos devices on the network) due to the lack of support in NativeScript for UDP socket connections.

When UDP socket connections become possible, Discovery APIs should be possible in NativeScript.

Contributions welcome. 😀

## What's next?
Additional Sonos APIs from the NodeJS library will be exposed in this plugin. If there is an API you need that is not yet exposed, [open an Issue](https://github.com/toddanglin/nativescript-sonos/issues) and we'll try to prioritize it.

Contributions and constructive feedback welcome.

## License
MIT. Use it, transform it, whatever.