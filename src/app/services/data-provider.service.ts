import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Globals, WidgetTypes } from "./global";
import { Validations, CommonUtils } from "../common/utility";
import { IActionInfo, ActionTypes, IParameterValueFormat, IActionParameter, IDataResponse, IActionResponse, IActionHanldeResponse, IRoundtripActionInfo, IUserDetails } from "../common/interfaces";
import { Observer, Observable } from "rxjs";
import { tap, flatMap, catchError } from "rxjs/operators";
import { DataTransformationService } from "./data-transformation.service";
import { LoggerService } from "../modules/architecture-module/services/log-provider.service";
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from "./storage";
import { UserFeedbackMessages } from "../common/constants";
import { AppFormData } from "../common/app-data-format";


@Injectable()
export class ActionExecutorService {
  constructor(private http: HttpClient, private global: Globals, private logger: LoggerService, private dataTransformer:
    DataTransformationService, private router: Router, private route: ActivatedRoute, private storage: StorageService) {

  }

  public performAction(actionInfo: IActionInfo, parameters?: IParameterValueFormat, metaType?: string, transformationType?: string, formDataForFile?: FormData) {
    let dataObserver: Observable<Object> = null;
    // give priority to transformation provided in the action info
    transformationType = actionInfo.transformationType ? actionInfo.transformationType : transformationType;
    switch (actionInfo.type.toUpperCase()) {
      case ActionTypes.Rest:
        dataObserver = this.performRestOperation(actionInfo, parameters, metaType, transformationType, formDataForFile);
        break;
      case ActionTypes.InlineData:
        dataObserver = this.getInlineData(actionInfo, parameters, metaType);
        break;
      case ActionTypes.Url:
        this.performRouteNavigationAction(actionInfo, parameters);
        break;
      case ActionTypes.Local:
        dataObserver = this.performLocalAction(actionInfo, parameters);
        break;
      default:
        break;
    }
    return dataObserver;
  }

  public fillParameterDefaultValues(parameters: IActionParameter[], parametersValues: IParameterValueFormat) {
    if (!Validations.isNullOrUndefined(parameters) && !Validations.isNullOrUndefined(parametersValues)) {
      for (const parameter of parameters) {
        if (!Validations.isNullOrUndefined(parametersValues[parameter.id])) {
          parameter.default = parametersValues[parameter.id];
        }
      }
    }
  }

  private performRouteNavigationAction(actionInfo: IActionInfo, parameters: IParameterValueFormat) {
    let navigationParam = null;
    let isParamMendatory = false;
    if (!Validations.isNullOrUndefined(actionInfo.parameters) && actionInfo.parameters.length > 0) {
      navigationParam = this.getNavigationParams(actionInfo, parameters);
      isParamMendatory = true;
    }
    if (!Validations.isNullOrUndefined(actionInfo.url) && (!isParamMendatory || navigationParam)) {
      const urlToNavigate: string = navigationParam ? actionInfo.url + "/" + navigationParam : actionInfo.url;
      if (!Validations.isNullOrUndefined(navigationParam)) {
        this.router.navigate([actionInfo.url, navigationParam]);
      } else {
        this.router.navigate([actionInfo.url]);
      }
      // this.router.navigate([urlToNavigate]);
    } else {
      this.logger.logError("either url or parameters are not provided in navigation action");
      this.logger.logError(actionInfo);
      this.logger.logError(parameters);
    }
  }

  private getNavigationParams(actionInfo: IActionInfo, parametersValues: IParameterValueFormat) {
    let requestParams: any = this.prepareRequestParams(actionInfo.parameters, parametersValues);
    if (CommonUtils.isValidResponse(requestParams)) {
      requestParams = requestParams.response;
      let urlToAppend = [];
      for (const parameterId in requestParams) {
        if (requestParams.hasOwnProperty(parameterId)) {
          urlToAppend.push(requestParams[parameterId]);
        }
      }
      return urlToAppend.join("/");
    }
    return false;
  }

  private prepareActionRequest(actionInfo: IActionInfo, parametersValues: IParameterValueFormat) {
    let requestParams = this.prepareRequestParams(actionInfo.parameters, parametersValues);
    if (CommonUtils.isValidResponse(requestParams)) {
      requestParams = requestParams.response;
      if (!Validations.isNullOrUndefined(actionInfo.sendAllParam) && actionInfo.sendAllParam) {
        requestParams = { ...requestParams, ...parametersValues };
      }
      const requestData = new ActionPayload(actionInfo, this.global.currentUserValue, requestParams);
      return CommonUtils.prepareResponse(1, requestData.preparePayoadForGetRequest());
    }
    return requestParams;
  }

  private getInlineData(actionInfo: IActionInfo, parametersValues: IParameterValueFormat, metaType: string) {
    const dataResp: IDataResponse = {
      data: actionInfo.data,
    }
    const responseObj = {
      status: 1,
      errorCode: 0,
      errorMessage: null,
    }
    return new Observable((observer) => {
      const dataTransformObserver = this.dataTransformer.transformData(dataResp, metaType, "RAW");
      dataTransformObserver.subscribe(res => {
        const actionResponse = this.prepareActionResponseObservable(res, actionInfo, responseObj);
        observer.next(actionResponse);
        observer.complete();
      });
    })
  }

  private performLocalAction(actionInfo: IActionInfo, parametersValues: any) {
    const dataResp: IDataResponse = {
      data: actionInfo.data,
    }
    const responseObj = {
      status: 1,
      errorCode: 0,
      errorMessage: null,
      paramValues: parametersValues,
    }
    return new Observable((observer) => {
      const actionResponse = this.prepareActionResponseObservable(null, actionInfo, responseObj);
      observer.next(actionResponse);
      observer.complete();
    });
  }

  private performRestOperation(actionInfo: IActionInfo, parametersValues: IParameterValueFormat, metaType?: string, transformationType?: string, formDataForFile?: FormData) {
    let dataObserver: Observable<Object> = null;
    switch (actionInfo.method) {
      case "get":
        dataObserver = this.getDataFromRestCall(actionInfo, parametersValues, metaType, transformationType);
        break;
      case "post":
        dataObserver = this.postDataByRestCall(actionInfo, parametersValues, metaType, transformationType);
        break;
      case "fileUpload":
        dataObserver = this.uploadFileByRestCall(actionInfo, formDataForFile, parametersValues);
        break;
      default:
        break;
    }
    return dataObserver;
  }

  private getDataFromRestCall(actionInfo: IActionInfo, parametersValues: IParameterValueFormat, metaType: string, transformationType?: string) {
    const requestParams = this.prepareActionRequest(actionInfo, parametersValues);
    if (CommonUtils.isValidResponse(requestParams)) {
      return this.http.get(actionInfo.dev_url, {
        params: requestParams.response as any,
      }).pipe(
        flatMap((httpData: any) => {
          let responseData = httpData;
          return new Observable((observer: any) => {
            if (httpData.status === 1) {
              responseData = httpData.payload;
              transformationType = transformationType ? transformationType : "Tabular";
              const dataTransformObserver = this.dataTransformer.transformData(responseData, metaType, transformationType);
              dataTransformObserver.subscribe(
                res => {
                  const actionResponse = this.prepareActionResponseObservable(res, actionInfo, httpData);
                  observer.next(actionResponse);
                  observer.complete();
                }, err => {
                  const actionResponse = this.prepareActionResponseObservable(null, actionInfo, httpData);
                  observer.next(actionResponse);
                  observer.complete();
                });
            } else {
              this.logger.logError("Failure response found for action" + httpData.action);
              this.logger.logError(httpData);
              const actionResponse = this.prepareActionResponseObservable(null, actionInfo, httpData);
              observer.next(actionResponse);
              observer.complete();
            }
          });
        })
      )
        .catch(res => {
          // The error callback (second parameter) is called
          return Observable.throw(res);
        });
    } else {
      return this.getActionResponseAsObservable(actionInfo, requestParams);
    }
  }

  private prepareActionResponseObservable(data: any, actionInfo: IActionInfo, responseMeta: IActionHanldeResponse) {
    const dataObject = responseMeta;
    dataObject.data = data;
    dataObject.actionInfo = CommonUtils.copyObject(actionInfo); // pass a new reference because calling party will change acion info object according to response
    return dataObject;
  }

  private postDataByRestCall(actionInfo: IActionInfo, parametersValues: IParameterValueFormat, metaType: string, transformationType: string) {
    const requestParams = this.prepareActionRequest(actionInfo, parametersValues);
    if (CommonUtils.isValidResponse(requestParams)) {
      // Hanlde certain actions on application level i.e login, logout
      const actionResponseObserver = this.http.post(actionInfo.dev_url, requestParams.response);
      // if (!isResponseHandled) {
      return actionResponseObserver.pipe(
        flatMap((res: any) => {
          // add data key in payload for symmatri purpose with get and other request
          if (!Validations.isNullOrUndefined(res.payload) && Validations.isNullOrUndefined(res.payload.data)) {
            res.payload = {
              data: res.payload
            }
          }
          const responseObservable = this.getActionResponseAsObservable(actionInfo, res);
          this.global.subscribeActionResponse(actionInfo, responseObservable);
          return responseObservable;
        })
      );
      // } else {
      //   return actionResponseObserver;
      // }
    } else {
      return this.getActionResponseAsObservable(actionInfo, requestParams);
    }
  }

  private uploadFileByRestCall(actionInfo: IActionInfo, requestParams: FormData, parametersValues: any) {
    let requestParameters = this.prepareActionRequest(actionInfo, parametersValues) as any;
    if (CommonUtils.isValidResponse(requestParameters)) {
      // send form data as well 
      requestParameters = requestParameters.response;
      requestParams.append("requestParams", requestParameters.requestParams);
      requestParams.append("userInfo", requestParameters.userInfo);
      requestParams.append("actionInfo", requestParameters.actionInfo);
      const actionResponseObserver = this.http.post(actionInfo.dev_url, requestParams);
      return actionResponseObserver.pipe(
        flatMap((res: any) => {
          // add data key in payload for symmatri purpose with get and other request
          if (!Validations.isNullOrUndefined(res.payload) && Validations.isNullOrUndefined(res.payload.data)) {
            res.payload = {
              data: res.payload
            }
          }
          const responseObservable = this.getActionResponseAsObservable(actionInfo, res);
          return responseObservable;
        })
      );
    } else {
      const responseObservable = this.getActionResponseAsObservable(actionInfo, requestParameters);
      return responseObservable;
    }
  }

  private getActionResponseAsObservable(actionInfo, responseObj?: any) {
    if (Validations.isNullOrUndefined(responseObj)) {
      responseObj = {
        status: 0,
        errorCode: 0,
        errorMessage: UserFeedbackMessages.ACTION_FAILURE_RESPONSE,
      }
    }
    return new Observable((observer) => {
      const actionResponse = this.prepareActionResponseObservable(null, actionInfo, responseObj);
      observer.next(actionResponse);
      observer.complete();
    })
  }

  private getSystemParameterValue(parameter: IActionParameter) {
    let value = null;
    switch (parameter.id.toLowerCase()) {
      case "userid":
        value = this.global.currentUserValue.userId;
        break;
      case "domain":
        value = this.global.clientGlobals.domain;
        break;
    }
    return value;
  }

  private prepareRequestParams(parameters: IActionParameter[], parametersValues: IParameterValueFormat) {
    const requestParams: IParameterValueFormat = {};
    const errorParams = [];
    if (!Validations.isNullOrUndefined(parameters)) {
      for (const parameter of parameters) {
        let value = null;
        if (!Validations.isNullOrUndefined(parameter.isSystem) && parameter.isSystem) {
          value = this.getSystemParameterValue(parameter);
        } else if (!Validations.isNullOrUndefined(parametersValues) && !Validations.isNullOrUndefined(parametersValues[parameter.id]) && parametersValues[parameter.id]) {
          value = parametersValues[parameter.id];
        } else if (!Validations.isNullOrUndefined(parameter.source)) {
          value = this.fillSystemParameter(parameter);
        } else if (!Validations.isNullOrUndefined(parameter.default)) {
          value = parameter.default;
        }
        if (!Validations.isNullOrUndefined(value)) {
          requestParams[parameter.id] = value;
        }
        else if (parameter.isMendatory) { // TODO add another else if to fill parameter from system values i.e user id , authontication token
          errorParams.push((parameter.title || parameter.id));
          this.logger.logError("Mendatory parameter is not provided for rest call: " + parameter.id + " parameters" + JSON.stringify(parametersValues));
          // return CommonUtils.prepareResponse(0, null, 0, errorMessage);
        }
      }

    }
    if (errorParams.length > 0) {
      const errorMsg = "Please select " + errorParams.join(",");
      return CommonUtils.prepareResponse(0, null, 0, errorMsg);
    } else {
      return CommonUtils.prepareResponse(1, requestParams);
    }
  }

  private fillSystemParameter(parameterInfo: IActionParameter) {
    let value = null;
    switch (parameterInfo.source) {
      case "route":
        let idToCheck = parameterInfo.id;
        if (!Validations.isNullOrUndefined(parameterInfo.sourceValue)) {
          idToCheck = parameterInfo.sourceValue;
        }
        return this.storage.getRouteValue(idToCheck);
        break;
      case "system":
        if (!Validations.isNullOrUndefined(parameterInfo.sourceValue)) {
          if (parameterInfo.sourceValue === "userId" && this.global.isUserLoggedIn()) {
            value = this.global.currentUserValue.userId;
          } else if (parameterInfo.sourceValue === "token" && this.global.isUserLoggedIn()) {
            value = this.global.currentUserValue.token;
          } else {
            value = this.global.siteGlobals[parameterInfo.sourceValue];
          }
        }
        break;
    }
    return value;
  }
}

export class ActionPayload {
  public userInfo: UserInfo;
  public requrestParams: any;
  public actionInfo: IRoundtripActionInfo;
  public constructor(actionInfo: IActionInfo, userDetails: IUserDetails, requrestParams: any) {
    this.actionInfo = {
      title: actionInfo.title,
    }
    this.requrestParams = requrestParams;
    if (!Validations.isNullOrUndefined(userDetails)) {
      this.userInfo = new UserInfo(userDetails.token);
    } else {
      this.userInfo = new UserInfo(null);
    }
  }

  public preparePayoadForGetRequest() {
    return {
      userInfo: JSON.stringify(this.userInfo),
      actionInfo: JSON.stringify(this.actionInfo),
      requestParams: JSON.stringify(this.requrestParams),
    }
  }
}

export class UserInfo {
  public userId: string;
  public ip_address: string;
  public user_agent: string;
  public token: string;

  public constructor(token: string) {
    this.token = token;
  }
}