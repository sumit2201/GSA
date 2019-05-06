import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Globals } from '../../services/global';
import { ActionExecutorService } from '../../services/data-provider.service';
import { Validations, CommonUtils } from '../../common/utility';
import { RankingConst } from '../../common/constants';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { DataTransformationService } from '../../services/data-transformation.service';
import { IWidgetInfo } from '../../common/interfaces';
import { STATICWIDGETS } from '../../../config/static-widget-info';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  @Input() public widgetInfo: IWidgetInfo;
  @Input() public dataChangeHandler;
  public widgetForData: IWidgetInfo; // widget to show actual records
  public settings: any;
  public groupedRankingData: any[];
  public groupedRankingClass: any[]
  constructor(private logger: LoggerService,
    private global: Globals, private actionExecutor: ActionExecutorService, private dataTransformer:
      DataTransformationService) { }
  ngOnInit() {
    this.logger.logDebug("data recieved for ranking");
    this.logger.logDebug(this.widgetData);
    this.widgetForData = STATICWIDGETS["PLAINTABLE"];
    this.prepareConfigurationFromWidgetInfo();
    this.prepareRankingData();
  }

  private prepareDefaultSetting() {
    this.settings = {};
    this.settings.groupedKey = "team_classification";
    this.settings.metaType = "ranking";
  }

  private prepareConfigurationFromWidgetInfo() {
    this.prepareDefaultSetting();
    if (!Validations.isNullOrUndefined(this.widgetInfo.metaConfig)) {
      const metaConfig = this.widgetInfo.metaConfig;
      if (!Validations.isNullOrUndefined(metaConfig.groupedKey)) {
        this.settings.groupedKey = metaConfig.groupedKey;
      }
    }
    if (!Validations.isNullOrUndefined(this.widgetInfo.metaType)) {
      this.settings.metaType = this.widgetInfo.metaType;
    }
  }

  private prepareRankingData() {
    const finalRankingData = [];
    if (!Validations.isNullOrUndefined(this.widgetData) && !Validations.isNullOrUndefined(this.widgetData.getRawData())) {
      const dataFromDB = this.widgetData.getRawData().data;
      if (!Validations.isNullOrUndefined(dataFromDB)) {
        const teamWiseData = this.prepareTeamWiseRankingData(dataFromDB);
        const rankingData = this.prepareRankingArrayDataFromTeamWiseData(teamWiseData);
        this.prepareGroupedRankingTables(rankingData);
      } else {
        this.logger.logDebug("data is not valid for ranking from db");
        this.logger.logDebug(this.widgetData);
      }
    }
  }

  private getPlainTeamWiseRankingDataObject(dataObj: any) {
    return {
      teamId: dataObj.team_id,
      team_name: dataObj.team_name,
      team_classification: dataObj.team_classification,
      team_agegroup: dataObj.agegroup,
      runs_scored: 0,
      runs_allowed: 0,
      win: 0,
      winPercentage: 0,
      loss: 0,
      tie: 0,
      total_tournaments: 0,
      tournament_point: 0,
      number: 0,
      finish: 0,
      bonus_point: 0,
      first_point: RankingConst.FIRST_TIME_POINT,
      tournamentIds: [],
    }
  }

  public getTeamPoint(dataObj, type = 1) {
    let team_point = 0;
    let total_point = 0;

    if (type === 1) {
      total_point = ((dataObj.win) * 2) - (dataObj.loss) + (dataObj.tie) - (dataObj.runs_allowed) + (dataObj.runs_scored) - (dataObj.finish) + (dataObj.number) + (dataObj.bonus_point);
      total_point = (dataObj.is_double == 1) ? total_point * 2 : total_point;
      team_point = dataObj.first_point + total_point;
    } else {
      const max_point = dataObj.number * 5;
      if (dataObj.finish == 1) {
        team_point = max_point;
      } else {
        team_point = (dataObj.number - dataObj.finish + 1) * 5;
      }
      if (dataObj.finish == 1 || dataObj.finish == 2) {
        team_point = team_point * 2;
      }
    }
    return team_point;
  }

  private prepareTeamWiseRankingData(dataFromDB: any[]) {
    const teamWiseRankingData = {};
    let first_point = 0;
    for (const dataObj of dataFromDB) {
      if (Validations.isNullOrUndefined(teamWiseRankingData[dataObj.team_id])) {
        teamWiseRankingData[dataObj.team_id] = this.getPlainTeamWiseRankingDataObject(dataObj);
        first_point = RankingConst.FIRST_TIME_POINT;
      } else {
        first_point = 0;
      }
      dataObj.win = CommonUtils.toNumber(dataObj.win);
      dataObj.loss = CommonUtils.toNumber(dataObj.loss);
      dataObj.tie = CommonUtils.toNumber(dataObj.tie);
      dataObj.runs_allowed = CommonUtils.toNumber(dataObj.runs_allowed);
      dataObj.runs_scored = CommonUtils.toNumber(dataObj.runs_scored);
      teamWiseRankingData[dataObj.team_id].runs_scored = dataObj.runs_scored;
      teamWiseRankingData[dataObj.team_id].runs_allowed = dataObj.runs_allowed;
      teamWiseRankingData[dataObj.team_id].win += dataObj.win;
      teamWiseRankingData[dataObj.team_id].loss += dataObj.loss;
      teamWiseRankingData[dataObj.team_id].tie += dataObj.tie;
      teamWiseRankingData[dataObj.team_id].finish += dataObj.finish;
      teamWiseRankingData[dataObj.team_id].number += dataObj.number;
      let bonus = 0;
      if ((dataObj.loss == 0) && (dataObj.tie == 0)) {
        bonus = 30;
      } else if (dataObj.tie > 0 && dataObj.loss == 0) {
        bonus = 20;
      }
      dataObj.bonus_point = bonus;
      dataObj.first_point = first_point;
      teamWiseRankingData[dataObj.team_id].tournament_point += this.getTeamPoint(dataObj);
      if (teamWiseRankingData[dataObj.team_id].tournamentIds.indexOf(dataObj.tournament_id) === -1) {
        teamWiseRankingData[dataObj.team_id].tournamentIds.push(dataObj.tournament_id);
      }
    }
    return teamWiseRankingData;
  }

  private prepareRankingArrayDataFromTeamWiseData(teamWiseRankingData: any) {
    const rankingArrayData = [];
    for (const teamId in teamWiseRankingData) {
      if (teamWiseRankingData.hasOwnProperty(teamId)) {
        const dataObj = teamWiseRankingData[teamId];
        const totalTournamentCount = dataObj.tournamentIds.length;
        if (totalTournamentCount > 0) {
          dataObj.finish = dataObj.finish / totalTournamentCount;
          dataObj.number = dataObj.number / totalTournamentCount;
        }
        dataObj.total_tournaments = totalTournamentCount;
        if (dataObj.win + dataObj.loss + dataObj.tie != 0) {
          const winpercent = (dataObj.win / (dataObj.win + dataObj.loss + dataObj.tie)) * 1000;
        } else {
          dataObj.winpercent = 0;
        }
        rankingArrayData.push(dataObj);
      }
    }
    rankingArrayData.sort(this.sortRankingArrayData.bind(this));
    return rankingArrayData;
  }

  private sortRankingArrayData(a, b) {
    if (a.tournamnet_point == b.tournamnet_point) {
      if (a.winpercent == b.winpercent) {
        return 0;
      } else {
        return a.winpercent < b.winpercent ? 1 : -1;
      }
    } else {
      return a.tournamnet_point < b.tournamnet_point ? 1 : -1; // reverse order
    }
  }

  private prepareGroupedRankingTables(rankingData) {
    this.groupedRankingData = [];
    this.groupedRankingClass = [];
    if (!Validations.isNullOrUndefined(rankingData)) {
      const dataToConvert = rankingData;
      const source = from(dataToConvert);
      //group by age
      const example = source.pipe(
        groupBy((teamDetails: any) => {
          return teamDetails[this.settings.groupedKey];
        }),
        mergeMap(group => group.pipe(toArray()))
      ).subscribe((dataResp: any) => {
        const dataTransformObserver = this.dataTransformer.transformData({ data: dataResp }, this.settings.metaType, "Tabular");
        dataTransformObserver.subscribe(res => {
          this.groupedRankingData.push(res);
          this.groupedRankingClass.push(dataResp[0][this.settings.groupedKey]);
        });
      }, err => {
        this.logger.logError("data conversion failed for ranking");
        this.logger.logError(rankingData);
        this.logger.logError(err);
      })

    } else {
      this.logger.logError("data is not valid for ranking");
      this.logger.logError(rankingData);
    }
  }
}
