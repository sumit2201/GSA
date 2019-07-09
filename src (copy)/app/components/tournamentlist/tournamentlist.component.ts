import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent, TableColumn } from '../../common/app-data-format';
import { Validations, CommonUtils } from "../../common/utility";
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';
import { Globals } from 'src/app/services/global';
import { ActionExecutorService } from "../../services/data-provider.service";
import { AccessProviderService } from '../../services/access-provider';
import { LoginGuard } from "../../guards/login.guard";

@Component({
  selector: 'app-tournamentlist',
  templateUrl: './tournamentlist.component.html',
  styleUrls: ['./tournamentlist.component.scss']
})
export class TournamentlistComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public tournamentData: any;
  //@Input() public isPaging: boolean;

  constructor(
    private logger: LoggerService,
    private global: Globals,
    private actionExecutor: ActionExecutorService,
    private accessProvider: AccessProviderService
  ) { }

  public ngOnInit() {
    console.error("data recieved in component");
    console.error(this.widgetData);
    if (!Validations.isNullOrUndefined(this.widgetData)) {

      if (this.widgetData.hasValidRawData()) {
        this.tournamentData = this.widgetData.getRawData().data;
      } else {
        this.logger.logDebug("tournament data is not valid for tournament list");
        this.logger.logDebug(this.widgetData);
      }

    } else {
      this.logger.logDebug("data is not valid for tournament list");
      this.logger.logDebug(this.widgetData);
    }
  }
  public canUpdateTournaments() {
    return this.accessProvider.canUpdateTournaments();
  }
  public checkUserLogin() {
    if (this.accessProvider.isLoggedIn()) {
      return true;
    }
    else {
      return false;
    }
  }
}
