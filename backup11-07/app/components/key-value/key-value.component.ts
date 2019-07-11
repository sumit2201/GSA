import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent, TableColumn, TableRow } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Globals } from '../../services/global';
import { Validations } from '../../common/utility';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss']
})
export class KeyValueComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public heading: IKeyValueWidgetData
  public settings: any;
  public keyValueData: IKeyValueWidgetData[];
  constructor(private logger: LoggerService,
    private global: Globals) { }

  ngOnInit() {
    this.logger.logDebug("Data recieved in key value widget");
    this.logger.logDebug(this.widgetData);
    this.prepareKeyValueData();
  }

  public prepareKeyValueData() {
    this.settings = {};
    if (!Validations.isNullOrUndefined(this.widgetData) && !Validations.isNullOrUndefined(this.widgetData.table)) {
      const tableData = this.widgetData.table;
      // key value pair will only work with first row
      const columns = tableData.columns;
      const rows = tableData.rows;
      if (!Validations.isNullOrUndefined(columns) && !Validations.isNullOrUndefined(tableData.rows)
        && tableData.rows.length) {
        const dataRow = rows[0];
        const allKeyValueParis = [];
        for (const columnId in columns) {
          const columnInfo = columns[columnId];
          if (columnInfo.isVisible) {
            if (!Validations.isNullOrUndefined(columnInfo.isHeadingColumn) && columnInfo.isHeadingColumn) {
              this.heading = this.prepareDataObjForKeyValuePair(columnInfo, dataRow);
            } else {
              const keyValueObj = this.prepareDataObjForKeyValuePair(columnInfo, dataRow);
              allKeyValueParis.push(keyValueObj);
            }
          }
        }
        this.keyValueData = allKeyValueParis;
      } else {
        this.logger.logError("column or row data is not valid in key value widget");
        this.logger.logError(this.widgetData);
      }
    } else {
      this.logger.logError("widget data is not valid in ngOnInit in key value pair");
      this.logger.logError(this.widgetData)
    }
  }

  public prepareDataObjForKeyValuePair(columnInfo: TableColumn, data: any) {
    const dataObj: IKeyValueWidgetData = {
      key: columnInfo.title,
      value: data[columnInfo.columnId].value
    }
    return dataObj;
  }

  public getRegularDestribution() {
    if (!Validations.isNullOrUndefined(this.settings.rowElementCount)) {
      return (100 / this.settings.rowElementCount) + "%";
    } else {
      return "100%";
    }
  }

}

export interface IKeyValueWidgetData {
  key: string;
  value: any;
}
