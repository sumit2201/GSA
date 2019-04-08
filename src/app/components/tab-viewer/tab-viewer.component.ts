import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { IWidgetInfo } from '../../common/interfaces';
import { Validations } from '../../common/utility';

@Component({
  selector: 'app-tab-component',
  templateUrl: './tab-viewer.component.html',
  styleUrls: ['./tab-viewer.component.scss']
})
export class TabViewerComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public widgetsForTab: IWidgetInfo[] = [];
  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.prepareWidgetsForTab();
  }

  public getRegularDestribution(tabObj) {
    if (!Validations.isNullOrUndefined(tabObj.rowElementCount)) {
      return (100 / tabObj.rowElementCount) + "%";
    } else {
      return "100%";
    }
  }

  private prepareWidgetsForTab() {
    const rawData = this.widgetData.getRawData();
    if (!Validations.isNullOrUndefined(rawData.data) && !Validations.isNullOrUndefined(rawData.data.tabs)) {
      this.widgetsForTab = rawData.data.tabs;
    }
  }


}
