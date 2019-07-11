import { Component, OnInit, ApplicationRef, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IWidgetInfo, IActionHanldeResponse } from '../common/interfaces';
import { Globals } from '../services/global';
import { flatMap } from 'rxjs/operators';
import { Validations } from '../common/utility';
import { StorageService } from '../services/storage';
import { GenericMsgs } from '../common/constants';
import { ActionExecutorService } from "../services/data-provider.service";
import { TournamentProfileAction } from 'src/config/tournament-profile.widgets';
import { AppDataParent } from '../common/app-data-format';
import { LoggerService } from "../modules/architecture-module/services/log-provider.service";

@Component({
  selector: 'app-dynamic-route',
  templateUrl: './dynamic-route.component.html',
  styleUrls: ['./dynamic-route.component.scss']
})
export class DynamicRouteComponent implements OnInit { 
  public widget: any;
  public parameters = {};
  public headingMsg = null;
  public widgetData = null;
  public routeData = null;
  private routeDataSubscriber: any;
  constructor(public route: ActivatedRoute, private globals: Globals, private storage: StorageService,
    private dataProviderService: ActionExecutorService, 
    private logger: LoggerService
    ) {
  }

  ngOnInit() {
    this.routeDataSubscriber = this.route.data.pipe(
      flatMap((routeData: any) => { 
        this.routeData = routeData;
        return this.globals.getStaticWidgetAsObserver(routeData.type);
      }));
    this.routeDataSubscriber.subscribe((res) => {
      this.route.params
        .subscribe(params => {
          this.prepareHeadingMsg(this.route.snapshot.queryParams);
          // tId, teamId, userId
          // this.DataCue.performAction(Tourname);
          const tournamentId = params["tournamentId"];
          if (!Validations.isNullOrUndefined(tournamentId)) {
            const dataObserver = this.dataProviderService.performAction(TournamentProfileAction);
            dataObserver.subscribe((res: IActionHanldeResponse) => {
              if (!Validations.isNullOrUndefined(res) && !Validations.isNullOrUndefined(res.data) && res.data.hasValidRawData()) {
                this.widgetData = res.data.getRawData().data[0];
              }else{

                this.logger.logDebug("error in routedatasubscriber");
              }

            },
              (err: any) => {
                this.logger.logError("error in routedatasubscriber");
                this.logger.logError(err);
              }
            )
          }

          this.globals.storeRouteParamValues(this.route.snapshot.params, this.route.snapshot.queryParams);
          this.widget = res;
        });
    });
  }

  ngOnDestroy() {
    this.routeDataSubscriber.unsubscribe();
  }

  isArray(widgets: any) {
    return Validations.isArray(widgets);
  }

  private prepareHeadingMsg(queryParams: any) {
    if (!Validations.isNullOrUndefined(queryParams['showAccessMsg']) && queryParams['showAccessMsg']) {
      this.headingMsg = GenericMsgs.LOGIN_TO_VIEW;
    }
  }

}
