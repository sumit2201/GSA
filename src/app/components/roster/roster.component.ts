import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent, RawData } from 'src/app/common/app-data-format';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';
import { Validations } from 'src/app/common/utility';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  [x: string]: any;
  @Input() public widgetData: AppDataParent;
  public widgetRawData: RawData;
  public rosterData: any;
  constructor(private logger: LoggerService, private globals: Globals,) { }

  ngOnInit() {
    this.logger.logDebug("data in roster component");
    this.logger.logDebug(this.widgetData);
    this.prepareRosterData();
  }

  private prepareRosterData() {
    this.widgetRawData = this.widgetData.getRawData();
    const list = this.widgetRawData.data;
    
    this.rosterData = list;
  }

  public getRosterImageURL(id ,image) {
    if (!Validations.isNullOrUndefined(id && image)) {
        const rosterImagePath = this.globals.getTeamRosterPath(this.rosterData.id);
        return rosterImagePath + "/" + image;
    } else {
        return this.globals.getDefaultTeamRosterImage();
    }
}


 

}
