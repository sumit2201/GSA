import { Component, OnInit, ApplicationRef, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IWidgetInfo } from '../common/interfaces';
import { Globals } from '../services/global';
import { flatMap } from 'rxjs/operators';
import { Validations } from '../common/utility';
import { StorageService } from '../services/storage';
import { GenericMsgs } from '../common/constants';

@Component({
  selector: 'app-dynamic-route',
  templateUrl: './dynamic-route.component.html',
  styleUrls: ['./dynamic-route.component.scss']
})
export class DynamicRouteComponent implements OnInit {
  public widget: any;
  public parameters = {};
  public headingMsg = null;
  private routeDataSubscriber: any;
  constructor(public route: ActivatedRoute, private globals: Globals, private storage: StorageService) {
  }

  ngOnInit() {
    this.routeDataSubscriber = this.route.data.pipe(
      flatMap((routeData: any) => {
        return this.globals.getStaticWidgetAsObserver(routeData.type);
      }));
    this.routeDataSubscriber.subscribe((res) => {
      this.route.params
        .subscribe(params => {
          this.prepareHeadingMsg(this.route.snapshot.queryParams);
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

  private prepareHeadingMsg(queryParams: any){
      if(!Validations.isNullOrUndefined(queryParams['showAccessMsg']) && queryParams['showAccessMsg']){
        this.headingMsg = GenericMsgs.LOGIN_TO_VIEW;
      }
  }

}
