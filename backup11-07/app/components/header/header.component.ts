import {
    Component,
    OnInit,
    Input
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IWidgetInfo, IWidgetToggleSettings, IUserDetails, IGlobalSettings } from "../../common/interfaces";
import { Globals } from '../../services/global';

@Component({
    selector: "app-header",
    templateUrl: "./header.template.html",
    styleUrls: ["./header.style.scss"],
})
export class HeaderComponent implements OnInit {
    @Input() public heading: any;
    public localState: any;
    public currentUserValue: IUserDetails;
    public siteGlobals: IGlobalSettings;
    private loginWidget: IWidgetToggleSettings;
    private searchWidget: IWidgetToggleSettings;
    constructor(
        public route: ActivatedRoute, private router: Router, private globals: Globals
    ) {
    }

    public ngOnInit() {
        this.currentUserValue = this.globals.currentUserValue;
        this.siteGlobals = this.globals.siteGlobals;
        this.prepareStaticWidgets();
    }    

    public navigateTest(){
        this.router.navigate(['/team-profile',2766]);
    }

    private prepareStaticWidgets() {
        const settings = {
            label: "Login/Register",
            widgetInfo: this.globals.getStaticWidget("LOGINANDREGISTER"),
            widgetConfig: {
                showHeader: false,
            }
        };
        this.loginWidget = settings;
        const searchWidget = {
            widgetInfo: this.globals.getStaticWidget("APPSEARCH"),
            widgetConfig: {
                isPlainWidget: false,
            }
        };
        this.searchWidget = searchWidget;
    }

}

