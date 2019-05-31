import { Observable, Observer } from "rxjs";
import { IFormFieldDependencyInfo, AppDataParent } from "./app-data-format";
import { IOptionsValues } from "selenium-webdriver/chrome";

export interface IWidgetInfo {
    name: string;
    title: string;
    dataProvider?: IActionInfo;
    metaType?: string; // TODO: change string to pre-define type 
    transformationType?: string;
    widgetConfig?: IWidgetConfig;
    metaConfig?: any;
}

export interface IActionInfoParent {
    title?: string;
}

export interface IActionAferCall {
    type: string;
    widgetInfoList: IWidgetActionAfterResponce[];
    urlToNavigate?: string;
    actionInfo?: IActionInfo;
    hideSource?: boolean;
}

export interface IWidgetActionAfterResponce {
    widget?: IWidgetInfo;
    widgetKey?: string;
    dataAction: string;
    fieldId?: string;
}

export interface IActionInfo extends IActionInfoParent {
    id?: string;
    type: string;
    method?: string;
    context?: string;
    url?: string;
    dev_url?: string;
    parameters?: IActionParameter[];
    data?: any;
    transformationType?: string;
    otherDetails?: any;
    sendAllParam?: boolean;
    responseHandler?: IActionAferCall;
    parameterValueType?: string;
    doFileUpload?: boolean;
    fileUploadFields?: any[];
    fileUploadAction?: IActionInfo;
}

export const ActionResponseHandlingTypes = {
    widgetLoad: "widgetLoad",
    navigate: "navigate",
    updateSiteGlobals: "updateSiteGlobals",
    loadWidgetWithParameterDefaultValues: "loadWidgetWithParameterDefaultValues",
}


export interface IActionParameter {
    id: string;
    title?: string;
    isMendatory: boolean;
    default?: any;
    isSystem?: boolean;
    source?: string;
    sourceValue?: string;
}

export interface IDataResponse {
    data: any[];
    pagingInfo?: IPagingInfo;
}

export interface IPagingInfo {
    offset: number;
    total: number;
    limit: number;
}

export type IParameterValueFormat = { [key: string]: any };

export const ActionTypes = {
    Rest: "REST",
    InlineData: "INLINE",
    Url: "URL",
    Local: "LOCAL",
};

export type IMetaInfoFormat = { [key: string]: IMetaInfo };

export interface IMetaInfo {
    isVisible?: boolean;
    type: string; // data type values
    actionInfo: IActionInfo[];
}

export interface IWidgetToggleSettings {
    label?: string;
    imageUrl?: string;
    widgetInfo: IWidgetInfo;
    widgetConfig: IWidgetConfig;
}

export interface IElementPosition {
    left: number;
    top: number;
    height?: number;
    width?: number;
}

export interface IWidgetConfig {
    showHeader?: boolean;
    isPlainWidget?: boolean;
    customClass?: string;
}

export interface IFormField {
    id: string;
    type: string;
    title: string;
    native?:boolean;
    originalTitle?: string;
    customClass?: string;
    indexInGroup?:number;
    name?: string;
    isNonEmpty?: boolean;
    imageSource?: string;
    required?: boolean;
    disable?: boolean;
    hidden?: boolean;
    value?: any;
    dataProvider?: IActionInfo;
    dataChangeObserver?: any;
    dependencyInfo?: IFormFieldDependencyInfo[];
    options?: IFormFieldOptions[];
    fields: IFormField[];
    editable?: boolean; // for group fields
    groupFieldLoader?: any;
    imageFieldLoader?: any;
    groupFieldOptionsCreator?: any;
    groupFieldOptionsProvider?: any;
    valueToSet?: any;
    globalSettingField?: any;
      
}

export interface IFormGroupField extends IFormField {
    allRemovable?: boolean;
}

export interface IFormPlainTextField {
    subType: string;
    text: string;
    routerLink?: string;
    actionInfo: IActionInfo;
}

export interface IUserDetails {
    userId: string;
    userName: string;
    token: string;
    features: string[];
    isSuperAdmin: boolean;
    isDirector: boolean;
}

export interface IActionResponse {
    status: number;
    payload: any;
    errorCode: number;
    erroMessage: string;
}

export interface IActionHanldeResponse {
    actionInfo?: IActionInfo;
    status: number;
    errorCode?: number;
    erroMessage?: string;
    data?: AppDataParent;
    payload?: any;
    paramValues?: any;
}

export interface IRoundtripActionInfo {
    title: string;
}

export interface IAppMenuItem {
    id: string;
    title: string;
    type: string;
    link: string;
    children: IAppMenuItem[];
}

export interface IAppFormFieldDetail {
    name: string;
    options?: any;
    type?: string;
}

export interface IFormConfig {
    customClass?: string;
    submitOnLoad?: boolean;
    isRegistrationForm?: boolean;
}

export interface IDialogueData {
    title: string;
    text: string;
}
export interface IFormFieldOptions {
    title: string;
    value: string;
}
export interface IFormSchema {
    fields?: IFormField[];
    rows?: IFormRows[];
    actions: IActionInfo[];
}

export interface IFormRows {
    fields?: IFormField[];
}

export interface IGlobalSettings {
    stateValues: any[];
    sportValues: any[];
    siteHeading: string;
    siteNews: string;
    domainId: number;
    imageUrls: any;
}

export interface IClientGlobals {
    domain: string;
    ip?: string;
    location?: string;
}