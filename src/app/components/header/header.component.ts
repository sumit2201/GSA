import {
    Component,
    OnInit, AfterViewInit,
    Input
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IWidgetInfo, IWidgetToggleSettings, IUserDetails, IGlobalSettings } from "../../common/interfaces";
import { Globals } from '../../services/global';
import { AccessProviderService } from "src/app/services/access-provider";
import * as $ from 'jquery';


@Component({
    selector: "app-header",
    templateUrl: "./header.template.html",
    styleUrls: ["./header.style.scss"],
})
    
export class HeaderComponent implements OnInit, AfterViewInit{
    @Input() public heading: any;
    [x: string]: any;
    public localState: any;
    public currentUserValue: IUserDetails;
    public siteGlobals: IGlobalSettings;
    public loginWidget: IWidgetInfo;
    public registerWidget: IWidgetInfo;
    private searchWidget: IWidgetToggleSettings;
    constructor(
        public route: ActivatedRoute,
        private accessProvider: AccessProviderService, private router: Router, private globals: Globals
    ) {
    }

    public ngOnInit() {
        this.currentUserValue = this.globals.currentUserValue;
        this.siteGlobals = this.globals.siteGlobals;
        this.prepareStaticWidgets();
    }

    public navigateTest() {
        this.router.navigate(['/team-profile', 2766]);
    }


    public hasAccess(feature: string) {
        return this.accessProvider.hasAccess(feature);
    }

    public logout() {
        this.globals.logout();
    }

    private prepareStaticWidgets() {
        // this.modelWidgets = [];
        // const settings = {
        //     label: "Login/Register",
        //     widgetInfo: this.globals.getStaticWidget("LOGINANDREGISTER"),
        //     widgetConfig: {
        //         showHeader: false,
        //     }
        // };
        // this.loginWidget = settings;
        // const searchWidget = {
        //     widgetInfo: this.globals.getStaticWidget("APPSEARCH"),
        //     widgetConfig: {
        //         isPlainWidget: false,
        //     }
        // };
        // this.searchWidget = searchWidget;

        this.loginWidget = this.globals.getStaticWidget("LOGINANDREGISTER"),

        this.registerWidget = this.globals.getStaticWidget("LOGINANDREGISTER")
    }
    ngAfterViewInit() {
        if ($('.kode-header-absolute').length) {
            // grab the initial top offset of the navigation 
            //var stickyNavTop = $('#mainbanner').offset().top;
            var stickyNavTop = 40;
            // our function that decides weather the navigation bar should have "fixed" css position or not.
            var stickyNav = function() {
                var scrollTop = $(window).scrollTop(); // our current vertical position from the top
                // if we've scrolled more than the navigation, change its position to fixed to stick to top,
                // otherwise change it back to relative
                if (scrollTop > stickyNavTop) {
                    $('.kode-header-absolute').addClass('kf_sticky');
                } else {
                    $('.kode-header-absolute').removeClass('kf_sticky');
                }
            };
            stickyNav();
            // and run it again every time you scroll
            $(window).scroll(function() {
                stickyNav();
            });
        }
    
    }
}

