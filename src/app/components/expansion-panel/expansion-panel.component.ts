import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Validations } from '../../common/utility';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { ActionExecutorService } from 'src/app/services/data-provider.service';
import { StoreCommentsAction, STATICWIDGETS } from 'src/config/static-widget-info';
import { AccessProviderService } from 'src/app/services/access-provider';
import { RemoveTeamfromTournamentsAction } from 'src/config/static-widget-info';
import { saveMaxNumberOfTeam } from 'src/config/static-widget-info';
import { MatDialog } from '@angular/material';
import { AppDialogueComponent } from '../app-dialogue/app-dialogue.component';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public expandableData: any;
  public editStateAgegroups: number[] = [];
  public selectNumberAgegroups: number[] = [];
  public agegroupWiseConfig: object = {};
  validRes: boolean;
  constructor(private logger: LoggerService,
    private actionExecutor: ActionExecutorService,
    private accessProvider: AccessProviderService, public dialog: MatDialog) { }

  ngOnInit() {
    this.prepareExpandableData();
  }

  private prepareExpandableData() {
    this.expandableData = [];
    const rawData = this.widgetData.getRawData();
    if (!Validations.isNullOrUndefined(rawData) && !Validations.isNullOrUndefined(rawData.data)) {
      const dataToConvert = rawData.data.teamsData;
      const source = from(dataToConvert);
      this.propareagegroupwiseconfig(rawData.data.tournamentConfig);
      //const tournamentconfigConvert = rawData.data.tournamentConfig;
      //group by age
      const example = source.pipe(
        groupBy((teamDetails: any) => {
          this.addAgegroupWiseconfigEntry(teamDetails.Played_Agegroup);
          return teamDetails.Played_Agegroup;
        }),
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

  public openAgegroupClassificationChangeDialogue(teamId: number, teamName: string) {
    const formWidget = STATICWIDGETS['CHANGEAGECLASSINTOURNAMENT'];
    formWidget.dataProvider.data.formDataParameters = {
      teamId,
    }
    // changing dynamic values directly in form schema since this form is only for this 
    // functionality
    const headingText = "Change agegroup and classification of " + teamName;
    formWidget.dataProvider.data.schema.fields[0].text = headingText;
    const dialogRef = this.dialog.open(AppDialogueComponent, {
      width: '500px',
      data: { widget: formWidget },
    });
  }

  public isAgegroupObjectCreated(Played_Agegroup) {
    if (!Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup])) {
      return true;
    }
    return false;
  }

  public addAgegroupWiseconfigEntry(Played_Agegroup) {
    if (Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup])) {
      this.agegroupWiseConfig[Played_Agegroup] = {};
      this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams = 0;
    }
  }

  public propareagegroupwiseconfig(tournamentConfig) {
    if (!Validations.isNullOrUndefined(tournamentConfig)) {
      for (const configData of tournamentConfig) {
        this.addAgegroupWiseconfigEntry(configData.agegroup);
        this.agegroupWiseConfig[configData.agegroup].maxNumberOfTeams = configData.maxNumberOfTeams;
      }
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

  public resetCommentState(agegroup) {
    const indexOfAgegroup = this.editStateAgegroups.indexOf(agegroup);
    if (indexOfAgegroup > -1) {
      this.editStateAgegroups.splice(indexOfAgegroup, 1);
    }
  }

  public setNumberState(agegroup) {
    const indexOfAgegroup = this.selectNumberAgegroups.indexOf(agegroup);
    if (indexOfAgegroup > -1) {
      this.selectNumberAgegroups.splice(indexOfAgegroup, 1);
    } else {
      this.selectNumberAgegroups.push(agegroup);
    }
  }

  public resetNumberState(agegroup) {
    const indexOfAgegroup = this.selectNumberAgegroups.indexOf(agegroup);
    if (indexOfAgegroup > -1) {
      this.selectNumberAgegroups.splice(indexOfAgegroup, 1);
    }
  }

  public isCommentInEditState(teamDetails) {
    const indexOfAgegroup = this.editStateAgegroups.indexOf(teamDetails.Played_Agegroup);
    if (indexOfAgegroup > -1) {
      return true;
    }
    return false;
  }

  public isSelectNumberState(teamDetails) {
    const indexOfAgegroup = this.selectNumberAgegroups.indexOf(teamDetails.Played_Agegroup);
    if (indexOfAgegroup > -1) {
      return true;
    }
    return false;
  }

  public getOrderRegister(key, maxNumber) {
    const orderNo = parseInt(maxNumber) + parseInt(key) + 1;
    return orderNo;
  }

  public storeCommentsByDirector(dataRequiredForStorComment, agegroup) {
    const parameters = this.prepareParametersForStoringComments(dataRequiredForStorComment);
    this.actionExecutor.performAction(StoreCommentsAction, parameters).subscribe((res: any) => {
      this.validRes = this.actionExecutor.isValidActionResponse(res);
      if (this.validRes == true) {
        this.resetCommentState(agegroup);
      }
    }),
      (err: any) => {
        this.logger.logError("Error Store Comments by director");
        this.logger.logError(err);
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

  public saveMaxNumberOfTeam(agegroup) {
    const maxNumber = this.agegroupWiseConfig[agegroup].maxNumberOfTeams;
    const parameters = { "agegroup": agegroup, "maxNumber": maxNumber };
    this.actionExecutor.performAction(saveMaxNumberOfTeam, parameters).subscribe((res: any) => {
      this.validRes = this.actionExecutor.isValidActionResponse(res);
      if (this.validRes == true) {
        // this.resetNumberState(agegroup);
        location.reload();
      }
    }),
      (err: any) => {
        this.logger.logError("Error in save max Number of Team by director");
        this.logger.logError(err);
      }
  }

  public confirmremoveteam(name: string, teamId) {
    if (confirm("Are you sure to delete - " + name)) {
      //console.log("Implement delete functionality here");
      this.deleteTeamFromTournaments(teamId);
    }
  }

  public deleteTeamFromTournaments(teamId) {
    const parameters = { "teamId": teamId };
    this.actionExecutor.performAction(RemoveTeamfromTournamentsAction, parameters).subscribe((res: any) => {
      this.validRes = this.actionExecutor.isValidActionResponse(res);
      if (this.validRes == true) {
        location.reload();
      }
    }),
      (err: any) => {
        this.logger.logError("Error in Delete team From Tournaments");
        this.logger.logError(err);
      }
  }

  public getConfirmTeamList(agegroupWiseTeams: any[], Played_Agegroup: number) {
    if (!Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup]) && !Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams) && this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams > 0) {
      const confirmTeamList = agegroupWiseTeams.slice(0, this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams);
      return confirmTeamList;
    }
    return agegroupWiseTeams;
  }

  public haveTeamInWaitingList(agegroupWiseTeams: any[], Played_Agegroup: number) {
    if (!Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup]) && !Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams) && this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams > 0 && this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams < agegroupWiseTeams.length) {
      return true;
    }
    return false;
  }

  public getWaitingTeamList(agegroupWiseTeams: any[], Played_Agegroup: number) {
    if (!Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup]) && !Validations.isNullOrUndefined(this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams) && this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams > 0 && agegroupWiseTeams.length > this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams) {
      const waitingTeamList = agegroupWiseTeams.slice(this.agegroupWiseConfig[Played_Agegroup].maxNumberOfTeams, agegroupWiseTeams.length);
      return waitingTeamList;
    }
    return [];
  }

}
