import { Component, OnInit, ViewEncapsulation, ElementRef, OnDestroy, ChangeDetectorRef } from "@angular/core";
import * as $ from "jquery";

// import "./styles/themes/app.dark.theme.scss";
import { Globals } from './services/global';
import { IWidgetToggleSettings } from './common/interfaces';
import { MediaMatcher } from "@angular/cdk/layout";
import { ActionExecutorService } from "./services/data-provider.service";
import { AppDataParent } from "./common/app-data-format";
import { LoggerService } from "./modules/architecture-module/services/log-provider.service";
import { Validations } from "./common/utility";
import { SiteLoadAction } from "../config/static-widget-info";


/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: "app-root",
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    "./app.component.scss"
  ],
  templateUrl: "./app.template.html",
})

export class AppComponent implements OnInit, OnDestroy {
  public staticWidgets: { [key: string]: IWidgetToggleSettings } = {};
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private appElement: ElementRef, private logger: LoggerService,
    private globals: Globals, changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private actionExecutor: ActionExecutorService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  public ngOnInit() {
    // TODO
    this.globals.setClientGlobals();
    this.performSiteLoadAction();
  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  public isGlobalSettingRecieved() {
    return this.globals.hasGlobalSetting();
  }

  private performSiteLoadAction() {
    this.actionExecutor.performAction(SiteLoadAction).subscribe((res: any) => {
      if (!Validations.isNullOrUndefined(res)
        && !Validations.isNullOrUndefined(res.data)
        && !Validations.isNullOrUndefined(res.data.getRawData()) && !Validations.isNullOrUndefined(res.data.getRawData().data)) {
        this.handleSiteLoadSettingComplete();
        this.globals.setSiteGlobals(res.data.getRawData().data);
      } else {
        this.logger.logError(" Site global setting not recieved for ");
        this.logger.logError(res);
        this.handleSiteLoadSettingComplete();
        this.globals.setDefaultGlobals();
      }

    }, (err) => {
      // error here will block the whole site, so we will set global settings 
      // atleast to show national website
      this.logger.logError("error in loading site global setting");
      this.logger.logError(err);
      this.handleSiteLoadSettingComplete();
      this.globals.setDefaultGlobals();
    })
  }

  private handleSiteLoadSettingComplete() {
    this.prepareStaticWidgets();
  }

  private prepareStaticWidgets() {
    const settings = {
      label: "Settings",
      widgetInfo: this.globals.getStaticWidget("SETTINGS"),
      widgetConfig: {
        showHeader: false,
      }
    };
    this.staticWidgets["settings"] = settings;

    const menuWidget = {
      label: "Menu",
      widgetInfo: this.globals.getStaticWidget("SIDEBARMENU"),
      widgetConfig: {
        showHeader: false,
      }
    };
    this.staticWidgets["SIDEBARMENU"] = menuWidget;
  }

  public onActivate() {
    $(this.appElement.nativeElement).find(".generic-workflow").show();
  }

  public onDeactivate() {
    $(this.appElement.nativeElement).find(".generic-workflow").hide();
  }

}
