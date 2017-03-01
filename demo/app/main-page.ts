import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {HelloWorldModel} from './main-view-model';
import { isIOS } from "platform";
import { topmost } from "ui/frame";

declare var UIBarStyle;

export function navigatingTo(args: observable.EventData) {
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();

    if (isIOS) {
        var navigationBar = topmost().ios.controller.navigationBar;
        navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
    }
}