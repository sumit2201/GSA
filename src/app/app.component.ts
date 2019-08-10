import { Component, OnInit, ViewEncapsulation, ElementRef, OnDestroy, ChangeDetectorRef } from "@angular/core";
import * as $ from "jquery";

// import "./styles/themes/app.dark.theme.scss";
import { Globals } from './services/global';
import { IWidgetInfo, IWidgetToggleSettings } from './common/interfaces';
import { ActionExecutorService } from "./services/data-provider.service";
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

export class AppComponent implements OnInit {
  public loginWidget: IWidgetInfo;
  public registerWidget: IWidgetInfo;
  public menuWidget: IWidgetInfo;
  constructor(private appElement: ElementRef, private logger: LoggerService,
    private globals: Globals, private actionExecutor: ActionExecutorService) {
  }


  public ngOnInit() {
    // TODO
    this.globals.setClientGlobals();
    this.performSiteLoadAction();
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
    this.loginWidget = this.globals.getStaticWidget("LOGIN");
    this.registerWidget = this.globals.getStaticWidget("REGISTER");
    this.menuWidget = this.globals.getStaticWidget("SIDEBARMENU");
  }

  public onActivate() {
    $(this.appElement.nativeElement).find(".generic-workflow").show();
  }

  public onDeactivate() {
    $(this.appElement.nativeElement).find(".generic-workflow").hide();
  }

}
