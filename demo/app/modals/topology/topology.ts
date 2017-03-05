import { Page, ShownModallyData } from "ui/page";
import { Switch } from "ui/switch";
import { Button } from "ui/button";
import { EventData } from "data/observable";
import { PullToRefresh } from "nativescript-pulltorefresh";
import { TopologyViewModel } from "./topology-viewmodel";
import { Sonos } from "nativescript-sonos";

let vm: TopologyViewModel;
let sonos: Sonos;

function loaded(args: ShownModallyData) {
    console.log("Topology widget loaded");

    let page = <Page>args.object;
    let sonosIp = args.context;
    sonos = new Sonos(sonosIp);

    vm = new TopologyViewModel();
    vm.set("closeCallback", args.closeCallback);
    page.bindingContext = vm;

    sonos.getTopology()
        .then((result) => {
            vm.zones = result.zones;
        })
        .catch((err) => {
            console.warn("Updating Topology Failed", err);
            alert("Error updating the topology. Try again later.");
        });
}


function manualRefreshTopology(args: EventData) {
    let ptr = <PullToRefresh>args.object;

    sonos.getTopology()
        .then((result) => {
            vm.zones = result.zones;
        })
        .catch((err) => {
            console.warn("Updating Topology Failed", err);
            alert("Error updating the topology. Try again later.");
        })
        .then(() => {
            ptr.refreshing = false;
        })
}

export { loaded, manualRefreshTopology }
