import { Observable, PropertyChangeData, EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import * as trace from 'trace';
import { SonosZone } from "nativescript-sonos";

export class TopologyViewModel extends Observable {
  private _zones: Array<SonosZone>;
  public get zones(): Array<SonosZone> {
      return this._zones;
  }
  public set zones(value: Array<SonosZone>) {
      if (this._zones !== value) {
          this._zones = value;
          this.notifyPropertyChange("zones", value);
      }
  }

  constructor() {
    super();

    this._zones = new Array<SonosZone>();
  }

  public closeCallback() {
    // TODO: Extra close callback logic
  }

  public closeWindow() {
    this.closeCallback();
  }
}
