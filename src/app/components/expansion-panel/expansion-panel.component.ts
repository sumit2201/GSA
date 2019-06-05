import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Validations } from '../../common/utility';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public expandableData: any;
  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
    this.prepareExpandableData();
  }

  private prepareExpandableData() {
    this.expandableData = [];
    const rawData = this.widgetData.getRawData();
    if (!Validations.isNullOrUndefined(rawData) && !Validations.isNullOrUndefined(rawData.data)) {
      const dataToConvert = rawData.data;
      const source = from(dataToConvert);
      //group by age
      const example = source.pipe(
        groupBy((teamDetails: any) => teamDetails.Played_Agegroup),
        mergeMap(group => group.pipe(toArray()))
      ).subscribe((res: any) => {
        this.expandableData.push(res);
        this.logger.logError(res);
      }, err => {
        this.logger.logError("data conversion failed for expansion panel");
        this.logger.logError(this.widgetData);
        this.logger.logError(err);
      })

    } else {
      this.logger.logError("data is not valid for expansion panel");
      this.logger.logError(this.widgetData);  
    }
  }

  public getDetailToShow(teamDetails: any) {
    return teamDetails.name + "-" + teamDetails.coach + "-" + teamDetails.team_sanction + "-" + teamDetails.classificationTitle + "-" + teamDetails.team_state;
  }

}
