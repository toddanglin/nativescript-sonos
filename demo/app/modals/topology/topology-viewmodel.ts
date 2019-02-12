import { Observable, PropertyChangeData, EventData } from "tns-core-modules/data/observable";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import * as trace from 'tns-core-modules/trace';
import * as app from 'tns-core-modules/application';
import { SonosZone, SonosZoneDescription } from "nativescript-sonos";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { ObservableArray } from "tns-core-modules/data/observable-array";

export class TopologyViewModel extends Observable {
  private _closeCallback: Function;

  private _ip: string;
  public get selectedIP(): string {
    return this._ip;
  }
  public set selectedIP(value: string) {
    this._ip = value;
    this.notifyPropertyChange("selectedIP", value);
  }

  private _selectedUUID : string;
  public get selectedUUID() : string {
    return this._selectedUUID;
  }
  public set selectedUUID(v : string) {
    if (v === this.selectedUUID) return; // No change

    this._selectedUUID = v;
    this.notifyPropertyChange("selectedUUID", v);
  }

  private _zones: ObservableArray<{ isSelected: boolean, zone: SonosZone}>;
  public get zones(): ObservableArray<{ isSelected: boolean, zone: SonosZone}> {
    return this._zones;
  }
  public set zones(value: ObservableArray<{ isSelected: boolean, zone: SonosZone}>) {
    if (this._zones !== value) {
      this._zones = value;
      this.notifyPropertyChange("zones", value);
    }
  }

  public get closeCallback(): Function {
    return this._closeCallback;
  }
  public set closeCallback(value: Function) {
    this._closeCallback = value;
    this.notifyPropertyChange("closeCallback", value);
  }

  constructor() {
    super();

    this._zones = new ObservableArray<{ isSelected: boolean, zone: SonosZone}>();

    let r = app.getResources();
    r.zoneIconUrlConverter = this.zoneIconUrlConverter;
    app.setResources(r);
  }

  public onZoneTap(args: ItemEventData) {
    let grid = <GridLayout>args.view;
    let context = <{ isSelected: boolean, zone: SonosZone}>grid.bindingContext;

    this.selectedUUID = context.zone.uuid;
    this.selectedIP = context.zone.location.substring(0, context.zone.location.indexOf('/xml')).replace("http://", "").split(":")[0];

    // Updated ListView to show selected
    let index = this.zones.indexOf(context);
    this.zones.forEach((z, i) => {
      if (i === index) {
        z.isSelected = true;
        this.zones.setItem(i, z);
      } else {
        z.isSelected = false;
      }
    });
  }

  public zoneIconUrlConverter = {
    toView: (location: string, description: SonosZoneDescription) => {
      return location.substring(0, location.indexOf('/xml')) + description.iconList.icon[0].url[0];
    }
  }

  public closeWindow() {
    this.closeCallback(this.selectedIP);
  }
}
