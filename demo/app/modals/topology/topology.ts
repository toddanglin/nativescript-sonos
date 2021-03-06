import { Page, ShownModallyData } from "tns-core-modules/ui/page";
import { Switch } from "tns-core-modules/ui/switch";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { PullToRefresh } from "nativescript-pulltorefresh";
import { TopologyViewModel } from "./topology-viewmodel";
import { Sonos, SonosZoneGroup, SonosZone } from "nativescript-sonos";
import { ObservableArray } from "tns-core-modules/data/observable-array";

let vm: TopologyViewModel;
let sonos: Sonos;

function loaded(args: ShownModallyData) {
    console.log("Topology widget loaded");

    let page = <Page>args.object;
    let sonosIp = args.context;
    sonos = new Sonos(sonosIp);

    vm = new TopologyViewModel();
    vm.closeCallback = args.closeCallback;
    page.bindingContext = vm;

    loadZones();
}


function manualRefreshTopology(args: EventData) {
    let ptr = <PullToRefresh>args.object;

    loadZones()
        .catch((err) => {
            console.warn("Updating Topology Failed", err);
            alert("Error updating the topology. Try again later.");
        })
        .then(() => {
            ptr.refreshing = false;
        })
}

function loadZones(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let zoneGroups: Array<SonosZoneGroup>;

        // Get zone group state so we know which devices are grouped together
        sonos.getZoneGroupState()
            .then((zones) => {
                zoneGroups = zones;

                // Get extended description data for all zones (to get device models, icons)
                return sonos.getZonesWithDescriptions();
            })
            .then((descriptions) => {
                // Format the name for each group to show all grouped devices
                let displayZones = new ObservableArray<{ isSelected: boolean, zone: SonosZone}>();
                zoneGroups.forEach((r) => {
                    r.zoneMembers.forEach((m) => {
                        // Always lead name with group coordinator
                        if (m.uuid === r.coordinator) {
                            // Find the description result to add to this zone
                            descriptions.forEach((d) => {
                                if (d.uuid === m.uuid) {
                                    m.description = d.description;
                                }
                            });

                            // If 2 or 3 devices in group, show each device name
                            if (r.zoneMembers.length > 1 && r.zoneMembers.length <= 3) {
                                let displayMembers = r.zoneMembers.filter((z:any) => { return z.invisible != "1"; });
                                let groupString = "";
                                displayMembers.forEach((dm) => {
                                    if (dm.uuid !== m.uuid) {
                                        groupString += `${dm.name}, `;
                                    }
                                });
                                groupString = groupString.substring(0, groupString.length - 2);
                                m.name = `${m.name} + ${groupString}`;
                            } else if (r.zoneMembers.length > 3) {
                                // If more than three devices, just summarize with device count
                                let displayMembers = r.zoneMembers.filter((z:any) => { z.invisible != "1"; });
                                let groupCount = (displayMembers.length > 1) ? displayMembers.length - 1 : 1;
                                m.name = `${m.name} + ${ groupCount }`;
                            }

                            // Don't include BOOST device (if present) since cannot be directly user controlled
                            if (m.description.modelName.toLowerCase().indexOf("boost") === -1) {
                                displayZones.push({ isSelected: false, zone: m});
                            }
                        }
                    });
                });

                // Update viewmodel
                vm.zones = displayZones;
                resolve();
            })
            .catch((err) => {
                console.warn("ZONE GROUP ERROR: "+ err);
                reject(err);
            });
    });
}

export { loaded, manualRefreshTopology }
