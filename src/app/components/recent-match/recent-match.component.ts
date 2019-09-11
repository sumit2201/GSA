import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInfo } from 'src/app/common/interfaces';
import { Globals } from 'src/app/services/global';
import { Validations } from 'src/app/common/utility';


@Component({
  selector: 'app-recent-match',
  templateUrl: './recent-match.component.html',
  styleUrls: ['./recent-match.component.scss']
})
export class RecentMatchComponent implements OnInit {
  public widget: IWidgetInfo;
  public tounamentTableWidget: IWidgetInfo;
  @Input() public widgetData: any; 
  public tournamentData: any;
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.widgetData;
    this.prepareRecentTournamentsData();
    this.prepareStaticWidgets();
  }
  public prepareRecentTournamentsData(){
    if (!Validations.isNullOrUndefined(this.widgetData)
      && !Validations.isNullOrUndefined(this.widgetData.getRawData()) && !Validations.isNullOrUndefined(this.widgetData.getRawData().data)) {
      this.tournamentData = this.widgetData.getRawData().data;
      }
  }

  private prepareStaticWidgets() {
    this.tounamentTableWidget = this.globals.getStaticWidget("recentTournamentScore");
  }


}
