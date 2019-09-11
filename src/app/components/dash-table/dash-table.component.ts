import { Component, OnInit } from '@angular/core';
import { IWidgetInfo } from 'src/app/common/interfaces';
import { Globals } from 'src/app/services/global';
@Component({
  selector: 'app-dash-table',
  templateUrl: './dash-table.component.html',
  styleUrls: ['./dash-table.component.scss']
})
export class DashTableComponent implements OnInit {
  public teamTableWidget: IWidgetInfo;
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.prepareStaticWidgets();
  }
  private prepareStaticWidgets() {
    this.teamTableWidget = this.globals.getStaticWidget("TEAMLIST");
  }
}
