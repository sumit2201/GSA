import { Component, OnInit,Input } from '@angular/core';
import { AppDataParent, TableColumn } from '../../common/app-data-format';
import { Validations, CommonUtils } from "../../common/utility";
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';
import { Globals } from 'src/app/services/global';
import { ActionExecutorService } from "../../services/data-provider.service";
@Component({
  selector: 'app-tournamentlist',
  templateUrl: './tournamentlist.component.html',
  styleUrls: ['./tournamentlist.component.scss']
})
export class TournamentlistComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public data;
  //@Input() public isPaging: boolean;
  
  constructor(private logger:LoggerService,
    private global: Globals, private actionExecutor: ActionExecutorService) { }

  public ngOnInit() {
    console.error("data recieved in component");
    console.error(this.widgetData);
    if (!Validations.isNullOrUndefined(this.widgetData)) {
        // if (Validations.isNullOrUndefined(this.isPaging)) {
        //     this.isPaging = true;            
        // }
        //this.data = " tournamentData ";
       this.data = this.widgetData.getRawData().data;

    } else {
        this.logger.logDebug("data is not valid for tournament list");
        this.logger.logDebug(this.widgetData);
    }
  }
}