import {
    Component,
    OnInit,
    Input
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Globals } from "../../services/global";
import { IAppMenuItem } from "../../common/interfaces";
import { AppDataParent, RawData } from "../../common/app-data-format";
import { AccessProviderService } from "../../services/access-provider";
import { LoggerService } from "../../modules/architecture-module/services/log-provider.service";

@Component({
    selector: "app-side-bar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.style.scss"],
})
export class SideBarComponent implements OnInit {
    @Input() public widgetData: AppDataParent;
    public widgetRawData: RawData;
    public menuData: IAppMenuItem[];
    constructor(
        private logger: LoggerService, public route: ActivatedRoute, private globals: Globals, private accessProvider: AccessProviderService
    ) {
        // TODO
    }

    public ngOnInit() {
        this.prepareMenuData();
        this.route
            .data
            .subscribe((data: any) => {
                /**
                 * Your resolved data from route.
                 */
                // this.localState = data.yourData;
            });
    }

    public hasAccess(feature: string) {
        return this.accessProvider.hasAccess(feature);
    }

    public logout() {
        this.globals.logout();
    }

    private prepareMenuData() {
        this.widgetRawData = this.widgetData.getRawData();
        const list = this.widgetRawData.data;
        const map = {};
        let node;
        const roots = [];
        let i;
        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parentId !== "0") {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        this.menuData = roots;
    }
}
