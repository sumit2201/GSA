import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    SimpleChange,
    EventEmitter,
    Output,
    Inject,
    forwardRef,
    ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Globals } from "../../services/global";
import { LoggerService } from "../../modules/architecture-module/services/log-provider.service";;
import { Validations, CommonUtils } from "../../common/utility";
import { IPagingInfo, IActionHanldeResponse, IActionInfo, IWidgetInfo } from "../../common/interfaces";
import { AppDataParent, TableColumn } from '../../common/app-data-format';
import { WidgetLoaderComponent } from "../widgetloader/widget-loader.component";
import { ActionExecutorService } from "../../services/data-provider.service";
import { EventTypes } from "../../common/constants";

@Component({
    selector: "app-rich-table",
    templateUrl: "./rich-table.template.html",
    styleUrls: ["./rich-table.component.scss"],
})
export class RichTableComponent implements OnInit {
    @Input() public widgetData: AppDataParent;
    @Input() public dataChangeHandler;
    @Input() public isPaging: boolean;
    public onEventEmit: any;
    public settings: any;
    public rows: any[];
    public rowData: any[];
    public columns: any[];
    public pagingInfo: IPagingInfo;
    constructor(public route: ActivatedRoute, private logger: LoggerService,
        private global: Globals, private actionExecutor: ActionExecutorService, private cdr: ChangeDetectorRef
    ) {
        //
    }


    public ngOnInit() {
        console.error("data recieved in component");
        console.error(this.widgetData);
        if (!Validations.isNullOrUndefined(this.widgetData)) {
            if (Validations.isNullOrUndefined(this.isPaging)) {
                this.isPaging = true;
            }
            this.prepareNgTableData(this.widgetData);
            if (Validations.isNullOrUndefined(this.pagingInfo)) {
                this.isPaging = false;
            }
        } else {
            this.logger.logDebug("data is not valid for rich table");
            this.logger.logDebug(this.widgetData);
        }
    }

    public getCellValue(col, value) {
        return value;
    }

    public isUserBlocked(row: any,columnId: any) {
        const blockValue = row[columnId];
        // console.log(blockValue);
        if (blockValue == 0) {
            return false
        }
        return true;
    }

    public getRosterImageURL(col, value, row: any) {
        if (!Validations.isNullOrUndefined(value) && value) {
            const rosterImagePath = this.global.getTeamRosterPath(row.teamId);
            return rosterImagePath + "/" + value;
        } else {
            return this.global.getDefaultTeamRosterImage();
        }
    }

    public performActionFromTable(action: IActionInfo, row: any) {
        this.logger.logError(row);
        this.actionExecutor.fillParameterDefaultValues(action.parameters, row);
        const dataLoadObserver = this.actionExecutor.performAction(action, row);
        dataLoadObserver.subscribe(
            (res: IActionHanldeResponse) => {
                this.logger.logInfo("Handle action respone from form button");
                this.logger.logInfo(res);
                if (!Validations.isNullOrUndefined(this.onEventEmit)) {
                    this.onEventEmit(EventTypes.ACTION_SUCCESS, res);
                }
            },
            err => {
                // console
                this.logger.logError("Error in calling action from form button");
                this.logger.logError(err);
            }
        )
    }

    public performActionForBlockUnblock(action: IActionInfo, row: any, block: number) {
        this.logger.logError(row);
        const parameters = {
            userId: row.userId,
            block,
        }
        const dataLoadObserver = this.actionExecutor.performAction(action, parameters);
        dataLoadObserver.subscribe(
            (res: IActionHanldeResponse) => {
                this.logger.logInfo("Handle action respone from form button");
                this.logger.logInfo(res);
                if (this.actionExecutor.isValidActionResponse(res)) {
                    row.block = block;
                    this.cdr.detectChanges();
                }
                if (!Validations.isNullOrUndefined(this.onEventEmit)) {
                    this.onEventEmit(EventTypes.ACTION_SUCCESS, res);
                }
            },
            err => {
                // console
                this.logger.logError("Error in calling action from form button");
                this.logger.logError(err);
            }
        )
    }

    private prepareNgTableData(data: AppDataParent) {
        const columns = this.prepareColumnsForNgTable(data);
        const rows = this.prepareRowsForNgTable(data, columns);
        if (!Validations.isNullOrUndefined(columns) && !Validations.isNullOrUndefined(rows)) {
            this.rows = rows;
            this.pagingInfo = this.widgetData.pagingInfo;
        } else {
            this.logger.logError("No data is created for table" + data);
        }
    }

    private prepareColumnsForNgTable(data: AppDataParent) {
        // this wrapper is only written for a new reference and dis joint column structure in transformation and in ng2 smart table, both structure may change 
        const idWisetableColummns: { [key: string]: any } = {};
        const tableColummns: any[] = [];
        const columns = data.table.columns;
        if (!Validations.isNullOrUndefined(columns) && !Validations.isObjectEmpty(columns)) {
            for (const columnId in columns) {
                if (columns.hasOwnProperty(columnId)) {
                    const columnDetail = columns[columnId];
                    const columnObj = CommonUtils.copyObject(columnDetail);
                    columnObj.prop = columnId;
                    columnObj.name = columnDetail.title;
                    if (Validations.isNullOrUndefined(columnDetail.isVisible) || columnDetail.isVisible === true) {
                        columnObj.isVisible = true;
                    } else {
                        columnObj.isVisible = false;
                    }
                    if (!Validations.isNullOrUndefined(columnDetail.isHeadingColumn) || columnDetail.isHeadingColumn === true) {
                        // columnObj.flexGrow = 5;
                    }
                    if (!Validations.isNullOrUndefined(columnDetail.width)) {
                        columnObj.width = columnDetail.width;
                    }
                    idWisetableColummns[columnDetail.columnId] = columnDetail;
                    tableColummns.push(columnObj);
                }
            }
            this.columns = tableColummns;
            return idWisetableColummns;
        } else {
            this.logger.logWarn("columns were not found in data");
            this.logger.logWarn(data);
        }
    }

    public setPage(event) {
        console.error(event);
        const pagingInfo = {
            limit: event.limit,
            offset: event.offset,
        }
        const dataChangeObserver = this.dataChangeHandler(pagingInfo);
        dataChangeObserver.subscribe((widgetData: IActionHanldeResponse) => {
            this.widgetData = widgetData.data;
            this.prepareNgTableData(this.widgetData);
        }, (err) => {
            this.logger.logError("error while handling data response on paging event");
            this.logger.logError(event);
        })
    }

    private prepareRowsForNgTable(data: AppDataParent, columns: { [key: string]: any }) {
        const tableRows: any[] = [];
        const rows = data.table.rows;
        if (!Validations.isNullOrUndefined(rows)) {
            if (rows.length > 0) {
                for (const row of rows) {
                    const rowObj = {};
                    for (const columnId in columns) {
                        if (columns.hasOwnProperty(columnId) && !Validations.isNullOrUndefined(row[columnId])) {
                            rowObj[columnId] = row[columnId].value;
                        }
                    }
                    tableRows.push(rowObj);
                }
                this.rowData = tableRows;
                return tableRows;
            } else {
                this.logger.logWarn("rows were not found in data");
                this.logger.logWarn(data);
            }
        } else {
            this.logger.logWarn("rows were not found in data");
            this.logger.logWarn(data);
        }
    }
     
}
