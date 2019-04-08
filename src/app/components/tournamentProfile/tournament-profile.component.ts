import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInfo } from '../../common/interfaces';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../services/global';
import { WidgetProviderService } from '../../services/widget-provider.service';
import { StorageService } from '../../services/storage';
import { Validations } from '../../common/utility';
import { Observable } from 'rxjs';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';

@Component({
  selector: 'tournament-profile.component',
  templateUrl: './tournament-profile.component.html',
  styleUrls: ['./tournament-profile.component.scss']
})
export class TournamentProfileComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public widgets: { [key: string]: IWidgetInfo };
  public parameters: { [key: string]: string };
  public tournamentData: any;
  constructor(
    public route: ActivatedRoute,public logger: LoggerService,
    private global: Globals
  ) {
  }

  public ngOnInit() {
    this.prepareTournamentData();
    const widgetObserver = this.global.getWidgetList("tournament");
    if (!Validations.isNullOrUndefined(widgetObserver)) {
      Observable.forkJoin(widgetObserver).subscribe((data: any) => {
        this.widgets = data[0];
      }, () => {
        console.error("error occured");
      });
    }
  }

  public prepareTournamentData() {
    this.tournamentData = {};
    if (!Validations.isNullOrUndefined(this.widgetData) && !Validations.isNullOrUndefined(this.widgetData.getRawData())) {
        const rawData = this.widgetData.getRawData();
        if (!Validations.isNullOrUndefined(rawData.data) && rawData.data.length) {
            this.tournamentData = rawData.data[0];
        } else {
            this.logger.logDebug("widget raw data is not valid in user profile");
            this.logger.logDebug(this.widgetData);
        }
    } else {
        this.logger.logDebug("widget data is not valid in user profile");
        this.logger.logDebug(this.widgetData);
    }
}

}
