import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Globals, WidgetTypes } from "./global";
import { Validations } from "../common/utility";
import { IActionInfo, ActionTypes, IParameterValueFormat, IActionParameter, IMetaInfoFormat, IDataResponse } from "../common/interfaces";
import { Observer, Observable } from "rxjs";
import { tap, flatMap, catchError } from "rxjs/operators";
import { LoggerService } from "../modules/architecture-module/services/log-provider.service";
import { MetaProviderService } from "./meta-provider.service";
import { TableRow, AppDataParent, TableColumn, TableColumnFormat, RawData } from '../common/app-data-format';

@Injectable()
export class DataTransformationService {
    constructor(private http: HttpClient, private global: Globals, private logger: LoggerService, private metaProvider: MetaProviderService) {

    }

    public transformData(httpData: any, metaType: string, transformationType = "Tablular") {
        // const metaObservable = this.metaProvider.getMetaInfo(metaType);
        return this.metaProvider.getMetaInfo(metaType).pipe(
            catchError((err: any) => {
                return new Observable((observer) => {
                    observer.next({});
                    observer.complete();
                    this.logger.logError("Meta info is not recived for meta type" + metaType);
                    this.logger.logError(err);
                });
            }),
            flatMap((metaInfo: any) => {
                return this.prepareTransformData(httpData, metaInfo, transformationType);
            }),
        );
    }

    private prepareTransformData(dataResponse: IDataResponse, metaInfo: IMetaInfoFormat, transformationType: string) {
        return new Observable((observer) => {
            const dataObject = this.transformDataAccordingToType(dataResponse, metaInfo, transformationType);
            observer.next(dataObject);
            observer.complete();
        });
    }

    private transformDataAccordingToType(dataResponse: IDataResponse, metaInfo: any, transformationType: string) {
        switch (transformationType) {
            case "Tabular":
                return this.prepareTabularData(dataResponse, metaInfo, transformationType);
                break;
            default:
                return this.prepareRawData(dataResponse, metaInfo);
                break;
        }
    }

    private prepareRawData(dataResponse: IDataResponse, metaInfo: any) {
        const appDataObj = new AppDataParent();
        const actions = metaInfo ? metaInfo.actions : null;
        const rawData = new RawData(dataResponse.data, actions);
        appDataObj.rawData = rawData;
        return appDataObj;
    }

    private prepareTabularData(dataResponse: IDataResponse, metaInfo: any, transformationType: string) {
        const appDataObj = new AppDataParent();
        const columns = this.prepareColumns(metaInfo, dataResponse.data);
        appDataObj.table.columns = columns;
        const rows = this.prepareRows(columns, dataResponse.data);
        appDataObj.table.rows = rows;
        if (!Validations.isNullOrUndefined(dataResponse.pagingInfo)) {
            appDataObj.pagingInfo = dataResponse.pagingInfo;
        }
        return appDataObj;
    }

    private prepareColumns(metaInfo: any, dataArr: any[]) {
        const columns: TableColumnFormat = {};
        if (!Validations.isNullOrUndefined(metaInfo) && !Validations.isNullOrUndefined(metaInfo.columns)) {
            for (const columnId in metaInfo.columns) {
                if (metaInfo.columns.hasOwnProperty(columnId)) {
                    const columnInfo = metaInfo.columns[columnId];
                    columnInfo.columnId = columnId;
                    columns[columnId] = columnInfo;
                    if (Validations.isNullOrUndefined(columnInfo.isVisible)) {
                        columnInfo.isVisible = true;
                    }
                }
            }
        } else {
            this.logger.logInfo("Columns not found in meta info" + metaInfo);
        }
        return columns;
    }

    private prepareRows(columns: TableColumnFormat, dataArr: any[]) {
        const rows = [];
        if (!Validations.isNullOrUndefined(dataArr) && dataArr.length > 0) {
            for (const dataObj of dataArr) {
                const rowObj = [];
                for (const columnId in columns) {
                    if (columns.hasOwnProperty(columnId)) {
                        if (!Validations.isNullOrUndefined(dataObj[columnId])) {
                            const rowData = {} as TableRow;
                            rowData.value = dataObj[columnId];
                            rowData.actualValue = dataObj[columnId];
                            rowData.columnObj = columns[columnId];
                            rowObj[columnId] = rowData;
                        } else if (columns[columnId].type === "visibleAction" || columns[columnId].type === "selector") {
                            // here we show text only and not dependent on column value in data
                            const rowData = {} as TableRow;
                            rowData.value = columns[columnId].cellValue;
                            rowData.actualValue = columns[columnId].title;
                            rowData.columnObj = columns[columnId];
                            rowObj[columnId] = rowData;
                        }
                        else {
                            delete columns[columnId];
                        }
                    }
                }
                if (!Validations.isObjectEmpty(rowObj)) {
                    rows.push(rowObj);
                } else {
                    this.logger.logInfo("no compatible data found in row creation for data in transformation" + dataObj);
                }
            }
        } else {
            this.logger.logError("data is not valid for row conversion");
        }
        return rows;
    }
}
