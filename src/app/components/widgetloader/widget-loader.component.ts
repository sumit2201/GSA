import { Component, Input, ViewContainerRef, ViewChild, ChangeDetectorRef, AfterViewChecked, ComponentRef, AfterViewInit, OnInit } from "@angular/core";
import { WidgetProviderService } from "../../services/widget-provider.service";
import { LoggerService } from "../../modules/architecture-module/services/log-provider.service";
import { Validations, CommonUtils } from "../../common/utility";
import { ActionExecutorService } from "../../services/data-provider.service";
import { IWidgetInfo, IPagingInfo, IWidgetConfig, IActionHanldeResponse, ActionResponseHandlingTypes } from "../../common/interfaces";
import { FormFieldManager } from "../../services/form-field-manager";
import { EventTypes } from "../../common/constants";
import { STATICWIDGETS } from "../../../config/static-widget-info";


@Component({
  selector: "app-widget-loader",
  templateUrl: "./widget-loader.template.html",
  styleUrls: ["./widget-loader.style.scss"],
})
export class WidgetLoaderComponent implements AfterViewInit, OnInit {
  @ViewChild("dynamicWidgets", { read: ViewContainerRef }) private container: ViewContainerRef;
  @Input() private widget: IWidgetInfo;
  @Input() private widgetData: any;
  @Input() private parameters;
  @Input() private metaInfo;
  @Input() private widgetConfig: IWidgetConfig;
  public isLoading: boolean;
  public hideSource: boolean;
  public actionResponseWidget: IWidgetInfo[];
  public widgetSettings: IWidgetConfig = {};
  constructor(private widgetProvider: WidgetProviderService, private logger: LoggerService, private dataProvider: ActionExecutorService,
    private cdr: ChangeDetectorRef,
    private formFieldManager: FormFieldManager) {
  }

  public ngOnInit() {
    this.parameters = {};
    this.hideSource = false;
    this.widgetSettings = {};
    this.isLoading = true;
    this.setWidgetConfig();
  }

  public ngAfterViewInit() {
    this.loadComponents();
    this.cdr.detectChanges();
  }

  public updateData(pagingInfo: IPagingInfo) {
    console.error(event);
    this.parameters["pagingInfo"] = pagingInfo;
    return this.dataProvider.performAction(this.widget.dataProvider, this.parameters, this.widget.metaType, this.widget.transformationType);
  }

  public cardRequiredForWidget() {
    let isCardRequired = true;
    if (!Validations.isNullOrUndefined(this.widgetSettings) && this.widgetSettings.isPlainWidget) {
      isCardRequired = false;
    }
    // this.logger.logDebug("card required for widget "+ isCardRequired);
    // this.logger.logDebug(this.widget);
    return isCardRequired;
  }

  public getWidgetClass() {
    let className = "";
    if (!Validations.isNullOrUndefined(this.widgetSettings.customClass)) {
      className = this.widgetSettings.customClass;
    }
    return className;
  }


  public handleEvents(type, res: IActionHanldeResponse) {
    this.logger.logDebug("handle evnets");
    switch (type) {
      case EventTypes.ACTION_SUCCESS:
        this.handleActionSuccessResponse(res);
        break;
    }
  }

  private handleActionSuccessResponse(res: IActionHanldeResponse) {
    if (!Validations.isNullOrUndefined(res.actionInfo) && !Validations.isNullOrUndefined(res.actionInfo.responseHandler)) {
      switch (res.actionInfo.responseHandler.type) {
        case ActionResponseHandlingTypes.widgetLoad:
          this.prepareWidgetToShow(res);
          break;
        case ActionResponseHandlingTypes.navigate:
          this.performRouteNavigation(res);
          break;
        case ActionResponseHandlingTypes.updateSiteGlobals:
          location.reload();
          break;
      }
    }
  }

  private performRouteNavigation(res: IActionHanldeResponse) {

    if (!Validations.isNullOrUndefined(res.actionInfo.responseHandler.actionInfo)) {
      let paramValues = null;
      if (!Validations.isNullOrUndefined(res.payload) && !Validations.isNullOrUndefined(res.payload.data)) {
        paramValues = res.payload.data;
      } else {
        this.logger.logError("Form: Action Response data info is not provided in navigation action response");
        this.logger.logError(res);
      }
      this.dataProvider.performAction(res.actionInfo.responseHandler.actionInfo, paramValues);
    } else {
      this.logger.logError("Form: Action Response route action info is not provided in navigation action response");
      this.logger.logError(res);
    }
  }

  private prepareWidgetToShow(res: IActionHanldeResponse) {
    this.actionResponseWidget = [];
    const responseHandler = res.actionInfo.responseHandler;
    if (!Validations.isNullOrUndefined(responseHandler.hideSource) && responseHandler.hideSource) {
      this.hideSource = true;
    } else {
      this.hideSource = false;
    }
    if (!Validations.isNullOrUndefined(responseHandler.widgetInfoList)) {
      for (const newWidgetInfo of responseHandler.widgetInfoList) {
        let newWidget;
        // in json we can not directly reference a defined widget so supporting 
        // reading widget from key as well
        if (!Validations.isNullOrUndefined(newWidgetInfo.widgetKey)) {
          newWidget = CommonUtils.copyObject(STATICWIDGETS[newWidgetInfo.widgetKey]);
        } else {
          newWidget = CommonUtils.copyObject(newWidgetInfo.widget);
        }
        if (!Validations.isNullOrUndefined(newWidget)) {
          if (!Validations.isNullOrUndefined(newWidgetInfo.dataAction)) {
            if (newWidgetInfo.dataAction === "loadDataInField" && newWidget.name === "form") {
              if (!Validations.isNullOrUndefined(newWidget.dataProvider.data) && !Validations.isNullOrUndefined(newWidget.dataProvider.data.schema)) {
                const fieldDetails = this.formFieldManager.getFieldDetailsFromGroup(newWidgetInfo.fieldId, newWidget.dataProvider.data.schema.fields)
                fieldDetails.dataProvider = {
                  type: "INLINE",
                  data: res.data.getRawData().data,
                  otherDetails: {
                    fieldId: fieldDetails.id,
                  }
                }
                this.switchActionResponseWidget(newWidget);
              } else {
                this.logger.logError("Widget Loader: Action Response form data info is not provided in widget load");
                this.logger.logError(res);
              }
            } else if (newWidgetInfo.dataAction === "fillParameterDefault") {
              this.dataProvider.fillParameterDefaultValues(newWidget.dataProvider.parameters, res.paramValues);
              this.switchActionResponseWidget(newWidget);
            }
          }
          else {
            this.switchActionResponseWidget(newWidget);
          }
        } else {
          this.logger.logError("Widget Loader: Action Response widget info is not provided in widget load");
          this.logger.logError(res);
        }
      }
    } else {
      this.logger.logError("Widget Loader: Action Response widget info is not provided in widget load");
      this.logger.logError(res);
    }
  }

  private switchActionResponseWidget(widgetInfo: IWidgetInfo) {
    // this.cdr.detectChanges();
    this.actionResponseWidget.push(widgetInfo);
  }

  private setWidgetConfig() {
    // TODO: if widget config is passed as input then it should override widget config provided
    // in widget info basis on key by key , currently overriding the whole object
    if (!Validations.isNullOrUndefined(this.widgetConfig)) {
      this.widgetSettings = this.widgetConfig;
    } else if (!Validations.isNullOrUndefined(this.widget.widgetConfig)) {
      this.widgetSettings = this.widget.widgetConfig;
    }
  }

  private loadComponents() {
    let componentFactory = this.widgetProvider.mapWidgetWithComponent(this.widget);
    // if data is provided inline we will avoid dataProvider
    if (!Validations.isNullOrUndefined(this.widgetData)) {
      this.handleWidgetDataRecieveComplete(componentFactory, this.widgetData);
    } else {
      this.loadData(componentFactory, this.widget);
    }
  }

  private handleWidgetDataRecieveComplete(componentFactory, data) {
    setTimeout(() => {
      this.isLoading = false;
      let componentRef: any = this.container.createComponent(componentFactory);
      const cmpInstance = componentRef.instance as Component;
      componentRef.instance.widgetData = data;
      componentRef.instance.dataChangeHandler = this.updateData.bind(this);
      componentRef.instance.widgetInfo = this.widget;
      componentRef.instance.onEventEmit = this.handleEvents.bind(this);
    }, 2000);
  }

  private loadData(componentFactory: any, widgetInfo: IWidgetInfo) {
    if (!Validations.isNullOrUndefined(widgetInfo)) {
      const data = this.dataProvider.performAction(widgetInfo.dataProvider, this.parameters, widgetInfo.metaType, widgetInfo.transformationType);
      if (!Validations.isNullOrUndefined(data)) {
        data.subscribe((res: IActionHanldeResponse) => {
          // TODO: settting of instance data directly does not gurantee it reaches in ngOnInit of component all the time
          this.handleWidgetDataRecieveComplete(componentFactory, res.data);
        }, (err: any) => {
          this.logger.logError("error in fetching data in widget Loader component after load data call");
          this.logger.logError(err);
        });
      } else {
        this.logger.logWarn("no data found in widget Loader component after load data call");
        this.logger.logWarn(widgetInfo.dataProvider);
      }
    } else {
      this.logger.logInfo("no widget data found in widget Loader component in load data");
    }
  }

}
