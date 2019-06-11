import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Validations } from '../../common/utility';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { ActionExecutorService } from 'src/app/services/data-provider.service';
import { StoreCommentsAction } from 'src/config/static-widget-info';
import { AccessProviderService } from 'src/app/services/access-provider';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public expandableData: any;
  public editStateAgegroups: number[] = [];
  constructor(private logger: LoggerService, private actionExecutor: ActionExecutorService, private accessProvider: AccessProviderService) { }

  ngOnInit() {
    this.prepareExpandableData();
  }
  // onClick(j) {
  //   if($('.addtext'+j).css('display') == 'none'){
  //     $('.addtext'+j).show();
  //     $('.plantxt'+j).hide();
  //     $('#saveBtn'+j).show();
  //   }
  //   else{
  //     $('.addtext'+j).hide();
  //     $('.plantxt'+j).show(); 
  //     $('#saveBtn'+j).hide();
  //   }
  // }

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
        // sort res
        this.expandableData.push(res.sort(function (a, b) { return a.registrationId - b.registrationId; }));
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

  public setCommentState(agegroup) {
    const indexOfAgegroup = this.editStateAgegroups.indexOf(agegroup);
    if (indexOfAgegroup > -1) {
      this.editStateAgegroups.splice(indexOfAgegroup, 1);
    } else {
      this.editStateAgegroups.push(agegroup);
    }
  }

  public isCommentInEditState(teamDetails) {
    const indexOfAgegroup = this.editStateAgegroups.indexOf(teamDetails.Played_Agegroup);
    if (indexOfAgegroup > -1) {
      return true;
    }
    return false;
  }

  public storeCommentsByDirector(dataRequiredForStorComment) {
    const parameters = this.prepareParametersForStoringComments(dataRequiredForStorComment);
    this.actionExecutor.performAction(StoreCommentsAction, parameters).subscribe((res: any) => {
      
    }),
      (err: any) => {
        // log error
      }
  }

  public prepareParametersForStoringComments(allCommentdata) {
    const directorCommentsForTeams = [];
    for (const teamData of allCommentdata) {
      const objToPush: any = {};
      objToPush.teamId = teamData.teamId;
      objToPush.comments_by_director = teamData.comments_by_director;
      directorCommentsForTeams.push(objToPush);
    }
    return {
      directorCommentsForTeams,
    }
  }

}
