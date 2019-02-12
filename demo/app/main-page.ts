import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import {HelloWorldModel} from './main-view-model';
import { isIOS } from "tns-core-modules/platform";
import { topmost } from "tns-core-modules/ui/frame";

declare var UIBarStyle;
let vm: HelloWorldModel;

export function navigatingTo(args: observable.EventData) {
    vm = new HelloWorldModel();
    let page = <pages.Page>args.object;
    page.bindingContext = vm;

    if (isIOS) {
        var navigationBar = topmost().ios.controller.navigationBar;
        navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
    }
}

export function onVolumeSliderLoaded(args) {
    let slider = args.object;
    slider.on("valueChange", vm.volumeSliderChange);
}