import {Observable} from 'data/observable';
import {Sonos, SonosState} from 'nativescript-sonos';
import {PropertyChangeData} from 'data/observable';
import {prompt} from "ui/dialogs";

export class HelloWorldModel extends Observable {
    private _message: string;
    private _albumUrl: string;
    private _duration: number;
    private _position: number;
    private _playPauseText: string;
    private _currentState: SonosState;
    private _volume: number;
    private refreshTimer: number;
    private stateTimer: number;
    private volumeRefreshTimer: number;
    private volTimer: number;
    private sonos: Sonos;
    private _sonosIp: string;

    constructor() {
        super();

        this.sonosIp = "10.0.1.195";
        this.sonos = new Sonos(this.sonosIp);
        this.loadPlayerName();

        this.loadTrackInfo();

        this.refreshState();
        this.refreshVolume();
    }

    get sonosIp(): string {
        return this._sonosIp;
    }

    set sonosIp(value: string) {
        this._sonosIp = value;
        this.notifyPropertyChange("sonosIp", value);
    }

    private _zoneName: string;
    public get zoneName(): string {
        return this._zoneName;
    }
    public set zoneName(value: string) {
        if (this._zoneName !== value) {
            this._zoneName = value;
            this.notifyPropertyChange("zoneName", value);
        }
    }

    
    private _title : string;
    public get title() : string {
        return this._title;
    }
    public set title(v : string) {
        this._title = v;
        this.notifyPropertyChange("title", v);
    }

    private _artist: string;
    public get artist(): string {
        return this._artist;
    }
    public set artist(value: string) {
        if (this._artist !== value) {
            this._artist = value;
            this.notifyPropertyChange("artist", value);
        }
    }

    private _album: string;
    public get album(): string {
        return this._album;
    }
    public set album(value: string) {
        if (this._album !== value) {
            this._album = value;
            this.notifyPropertyChange("album", value);
        }
    }
    

    get albumUrl(): string {
        return this._albumUrl;
    }

    set albumUrl(value: string) {
        if (this._albumUrl !== value) {
            this._albumUrl = value;
            this.notifyPropertyChange("albumUrl", value);
        }
    }

    get duration(): number {
        return this._duration || 0;
    }

    set duration(value: number) { 
        this._duration = value;
        this.notifyPropertyChange("duration", value);
    }

    get timeRemaining(): number {
        return this.get("duration") - this.get("position");
    }

    get position(): number {
        return this._position || 0;
    }

    set position(value: number) { 
        this._position = value;
        this.notifyPropertyChange("position", value);
    }

    get currentState(): SonosState {
        return this._currentState || SonosState.STOPPED;
    }

    set currentState(value: SonosState) {
        if (value !== this._currentState) {
            this._currentState = value;
            this.notifyPropertyChange("currentState", value);
        }
    }

    get isPlaying(): boolean {
        let state = this.get("currentState");

        if (state === SonosState.PLAYING || state === SonosState.TRANSITIONING) {
            return true;
        } else {
            return false;
        }
    }

    get currentVolume(): number {
        return this._volume;
    }

    set currentVolume(value: number) {
        if (value !== this._volume) {
            this._volume = value;
            this.notifyPropertyChange("currentVolume", value);
        }
    }

    public changeIp() {
        prompt("Please enter your Sonos IP address:")
            .then((result) => {
                this.sonosIp = result.text;
                this.sonos = new Sonos(result.text);

                this.loadPlayerName();
                this.loadTrackInfo();
            });
    }

    public refreshState() {
        clearTimeout(this.stateTimer);
        this.sonos.getCurrentState()
            .then((result) => {
                if (this.currentState === result) {
                    return; // No change, no need to proceed
                }

                if (result === SonosState.PAUSED_PLAYBACK ||
                    result === SonosState.STOPPED ||
                    result === SonosState.NO_MEDIA_PRESENT) {
                   // Stop track refresh
                   clearTimeout(this.refreshTimer);
                } else if (result === SonosState.PLAYING) {
                    // Reload track info if playing again
                    this.loadTrackInfo();
                }

                this.currentState = result;
            })
            .catch((err) => {
                console.warn("ERROR: "+ err);
            })
            .then(() => {
                this.stateTimer = setTimeout(() => {
                    this.refreshState();
                }, 1000);
            })
    }

    public playPauseToggle() {
        let state = this.get("currentState");
        if (state === SonosState.PLAYING || state === SonosState.TRANSITIONING) {
            this.sonos.pause()
                .then((result) => {
                    clearTimeout(this.refreshTimer);
                });
        } else if (state === SonosState.NO_MEDIA_PRESENT) {
            this.sonos.selectQueue()
                .then((result) => {
                    return this.sonos.play();
                })
                .then((result) => {
                    this.loadTrackInfo();
                });
        } else {
            this.sonos.play()
                .then((result) => {
                    this.loadTrackInfo();
                })
                .catch((err) => {
                    alert("Hmm. It appears you have no music loaded. This usually happens if your Sonos has recently been rebooted.\n\nTry playing a song from the Sonos app, then this API should work (until the Sonos is rebooted again).");
                })
        }
    }

    public playNext() {
        this.sonos.next()
            .then(() => {
                // Refresh track details
                this.loadTrackInfo();
            });
    }

    public playPrevious() {
        this.sonos.previous()
            .then(() => {
                this.loadTrackInfo();
            })
    }

    public toggleMute() {
        this.sonos.getMuted()
            .then((result) => {
                this.sonos.setMuted(!result);
            });
    }

    public stop() {
        this.sonos.stop()
            .then((result) => {
                clearTimeout(this.refreshTimer);
            });
    }

    public volumeSliderChange(args: PropertyChangeData) {
        clearTimeout(this.volTimer);
        if (args.propertyName === "value") {
            clearTimeout(this.volumeRefreshTimer);
            let newVolume = Math.round(args.value);

            this.volTimer = setTimeout(() => {
                this.changeVolume(newVolume);
            }, 1000);
        }
    }

    public loadTrackInfo() {
       this.sonos.currentTrack()
            .then((result) => {
                this.title = result.title;
                this.artist = result.artist;
                this.album = result.album;

                if (result.albumArtUrl !== undefined) {
                    this.albumUrl = result.albumArtUrl;
                }

                this.position = result.position;
                this.duration = result.duration;

                return this.sonos.getCurrentState();
            })
            .then((state) => {
                if (state === SonosState.PLAYING || state === SonosState.TRANSITIONING) {
                    this.autoRefreshPosition();
                }
            })
            .catch((err) => {
                this.title = err;
            })
    }

    public secondsToTimeConverter = {
        toView: (value, format) => {
            return (format) ? "-"+ this.hhmmss(value) : this.hhmmss(value);
        }
    }

    private pad = (num) => {
        return ("0"+num).slice(-2);
    }

    private hhmmss = (secs) => {
        let minutes = Math.floor(secs / 60);
        secs = secs%60;
        let hours = Math.floor(minutes/60)
        minutes = minutes%60;

        let padHrs = this.pad(hours);
        let padMins = this.pad(minutes);
        let padSecs = this.pad(secs);
        
        let result: string;
        if (padHrs !== "00") {
            result = `${hours}:${padMins}:${padSecs}`;
        } else {
            result = `${minutes}:${padSecs}`;
        }
        return result;
    }

    private loadPlayerName() {
        this.sonos.getZoneAttrs()
            .then((data) => {
                this.zoneName = data.currentZoneName;
            });
    }

    private changeVolume(newVol: number) {
        this.sonos.setVolume(newVol)
            .catch((err) => {
                console.warn("Set Volume Error: "+ err);
            })
            .then(() => {
                // Restart volume refresh volTimer
                this.refreshVolume();
            });
    }

    private refreshVolume() {
        clearTimeout(this.volumeRefreshTimer);
        this.sonos.getVolume()
            .then((vol) => {
                this.currentVolume = vol;

                this.volumeRefreshTimer = setTimeout(() => {
                    this.refreshVolume();
                }, 1000)
            });
    }

    private autoRefreshPosition() {
        clearTimeout(this.refreshTimer);
        if (this.duration > 0 && this.position <= this.duration) {
            this.position = this.position + 1;

            this.refreshTimer = setTimeout(() => { this.autoRefreshPosition(); }, 1000);
        } else if (this.position >= this.duration && this.duration !== 0) {
            this.loadTrackInfo();
        } else if (this.duration === 0) {
            this.refreshTimer = setTimeout(() => {
               this.loadTrackInfo();
            }, 1000)
        }
    }
}