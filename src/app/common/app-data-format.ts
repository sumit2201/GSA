import { IActionInfo, IPagingInfo } from './interfaces';
import { Validations } from './utility';

export class AppDataParent {
    public table: TabularData;
    public rawData: RawData;
    public pagingInfo: IPagingInfo;
    public originatorAction: IActionInfo;
    constructor() {
        this.table = new TabularData();
        this.rawData = null;
    }

    public getRawData() {
        return this.rawData;
    }

    public hasValidRawData(){
        if(!Validations.isNullOrUndefined(this.rawData) && !Validations.isNullOrUndefined(this.rawData.data)){
            return true;
        }
        return false;
    }
}

export class RawData {
    public data: any;
    public actions: IActionInfo[];
    constructor(data: any[], actions: IActionInfo[]) {
        this.data = data;
        this.actions = actions;
    }
}

class TabularData {
    public rows: TableRowFormat[];
    public columns: TableColumnFormat;
    constructor() {
        this.rows = [];
        this.columns = {};
    }
}

export type TableRowFormat = { [key: string]: TableRow };
export type TableColumnFormat = { [key: string]: TableColumn };

export class TableRow {
    public value: any;
    public actualValue: any;
    public columnObj: TableColumn;
}

export class TableColumn {
    public columnId: string;
    public title: string;
    public dataType: string;
    public isVisible: boolean;
    public type?: string;
    public isHeadingColumn?:boolean;
    public cellValue?: string;
    public width?: number;
}

export class AppFormData {
    public schema: any;
    public formDataProvider: any;
    public actions: IActionInfo[];
    public formConfig: any;
}

export class IFormFieldDependencyInfo {
    fieldId: string;
    isGroup: boolean;
    groupField: string;
    type: string;
    bracketFieldIds?: any;
    sourceGroup?: any;
    actionInfo?: IActionInfo;
}