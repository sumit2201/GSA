import { Component, Input, OnInit, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { Validations, CommonUtils } from "../../../common/utility";
import { ActionExecutorService } from "../../../services/data-provider.service";
import { AppDataParent, IFormFieldDependencyInfo } from "../../../common/app-data-format";
import { FormFieldManager } from "../../../services/form-field-manager";
import { LoggerService } from "../../architecture-module/services/log-provider.service";
import { IFormField, IActionHanldeResponse, IActionInfo } from "../../../common/interfaces";
import { Observer } from "rxjs/Rx";
import { FormControl, FormGroup, FormArray } from "@angular/forms";
import { DependencyTypes } from "../../../common/constants";
import { ActionExecutorDirective } from "../../../directives/action-executor.directive";

@Component({
  selector: "field-builder",
  templateUrl: "./field-builder.template.html",
  styleUrls: ["./field-builder.style.scss"]
})
export class FieldBuilderComponent implements OnInit {
  @Input() public field: IFormField;
  @Input() public form: FormGroup;
  @Input() public fieldOptions: any;
  @Input() public parentQueueObservable: Observable<any>[];
  @Input() public formSubmittedByUser: boolean;
  @Input() public indexInGroup: number;
  public dataChangeObserver: any;
  get isValid() {
    if (this.field.type === "group") {
      return true;
    }
    return this.form.controls[this.field.id].valid;
  }
  get isDirty() {
    if (this.field.type === "group") {
      return false;
    }
    return this.form.controls[this.field.id].dirty;
  }

  get errorMessage() {
    const fieldControl = this.form.controls[this.field.id];
    let msg = this.field.name + " is required";
    if (!Validations.isNullOrUndefined(fieldControl.errors) && fieldControl.errors.email) {
      msg = this.field.name + " is not valid";
    }
    return msg;
  }

  constructor(private logger: LoggerService,
    private actionProviderService: ActionExecutorService,
    private formFieldManager: FormFieldManager, private cdr: ChangeDetectorRef
    , private viewContainerRef: ViewContainerRef, private actionDirective: ActionExecutorDirective) {
    // TODO:
  }

  public ngOnInit() {
    this.loadDataInFieldIfApplicable();
    this.onChanges();
    this.subscribeParentFieldChanges();
  }

  private loadDataInFieldIfApplicable(paramValuesByElement?: any, callback?: any) {
    const returnValue = null;
    if (!Validations.isNullOrUndefined(this.field.dataProvider)) {
      if (Validations.isNullOrUndefined(paramValuesByElement)) {
        paramValuesByElement = {};
      }
      const formValues = this.formFieldManager.getSourceFormValues(); // source as in main form
      const paramValues = { ...formValues, ...paramValuesByElement }
      const dataLoadObserver = this.actionProviderService.performAction(this.field.dataProvider, paramValues);
      dataLoadObserver.subscribe(
        (res: IActionHanldeResponse) => {
          if (CommonUtils.isValidResponse(res)) {
            this.loadDataInField(res.data as AppDataParent, res.actionInfo);
          }
          this.handleFieldLoadComplete();
          if (!Validations.isNullOrUndefined(callback)) {
            callback(res);
          }
          return CommonUtils.getResponseAsObservable(res);
        },
        err => {
          this.handleErrorOnFieldDataLoad(err);
        }
      )
    } else {
      this.handleFieldLoadComplete();
    }
  }

  private handleFieldLoadComplete() {
    this.setValueInField();
  }

  private isGroupField() {
    return this.field.type === "group";
  }

  private setValueInField() {
    const data = this.field.valueToSet;
    if (!Validations.isNullOrUndefined(data)) {
      switch (this.field.type) {
        case "text":
        case "richText":
        case "date":
        case "number":
        case "password":
        case "hidden":
        case "checkbox":
        case "dropdown":
          const formField = this.form.get(this.field.id) as FormControl;
          formField.setValue(data);
          delete this.field.valueToSet;
          break;
        case "autoComplete":
          console.error("auto complete options");
          console.error(this.field.options);
          const autoCompleteformField = this.form.get(this.field.id) as FormControl;
          if (Validations.isNullOrUndefined(this.field.sameIdTitle) || !this.field.sameIdTitle) {
            const selectedAutoCompleteOption = this.formFieldManager.getFieldOptionFromValue(this.field.valueToSet, this.field.options);
            autoCompleteformField.setValue(selectedAutoCompleteOption);
          } else {
            autoCompleteformField.setValue(data);
          }
          delete this.field.valueToSet;
          break;
        case "image":
          this.field.value = data;
          // this.field.imageFieldLoader();
          break;
      }
    } else {
      // if no value is given in dropdown field to prefill and it is set as non empty 
      // then we are selecting first value by default
      if (this.field.type === "dropdown") {
        if (!Validations.isNullOrUndefined(this.field.isNonEmpty) && this.field.isNonEmpty
          && !Validations.isNullOrUndefined(this.field.options)) {
          const formField = this.form.get(this.field.id) as FormControl;
          formField.setValue(this.field.options[0].value);
        }
      }
    }
  }

  // when certain action fails we need to handle it either to alert user or anything else
  // for ex bracket creation page actions
  private handleActionFailOnDataLoad(res) {
    if (!CommonUtils.isValidResponse(res) && !Validations.isNullOrUndefined(res.errorMessage)) {
      alert(res.errorMessage);
    }
  }

  private handleParentDataChange(res, newValue: any) {
    switch (res.type) {
      case DependencyTypes.dataReload:
        this.loadDataInFieldIfApplicable(res.params, this.handleActionFailOnDataLoad.bind(this));
        break;
      case DependencyTypes.addRows:
        let doRemoveAllBeforeAdd = true;
        if (!Validations.isNullOrUndefined(res.dependencyInfo) && !Validations.isNullOrUndefined(res.dependencyInfo.emptyBeforeAdd) && !res.dependencyInfo.emptyBeforeAdd) {
          doRemoveAllBeforeAdd = false;
        }
        // newValue here refers to number of new row to be added in group
        this.field.groupFieldLoader(null, newValue, doRemoveAllBeforeAdd);
        break;
      case DependencyTypes.addOptionsInGroupField:
        this.field.groupFieldOptionsCreator(res.params);
        break;
      case DependencyTypes.enableDisable:
        this.handleEnableDisableDependency(res, newValue);
        break;
      case DependencyTypes.showHide:
        this.handleShowHideDependency(res, newValue);
        break;
    }
  }

  private handleEnableDisableDependency(res: any, newValue: any) {
    if (!Validations.isNullOrUndefined(res.dependencyInfo) && !Validations.isNullOrUndefined(res.dependencyInfo.enableOn)) {
      const enableValueArray = res.dependencyInfo.enableOn;
      if (enableValueArray && enableValueArray.indexOf(newValue) > -1) {
        this.field.disable = false;
      } else {
        this.field.disable = true;
      }
      // this.viewContainerRef.remove();
      this.cdr.detectChanges();
      this.formFieldManager.resetFieldValidators(this.field, this.form);
    } else {
      this.logger.logError("mendatory dependency info is not provided in enable disable dependency");
      this.logger.logError(res);
    }
  }

  private handleShowHideDependency(res: any, newValue: any) {
    if (!Validations.isNullOrUndefined(res.dependencyInfo) && !Validations.isNullOrUndefined(res.dependencyInfo.displayOn)) {
      const displayValueArray = res.dependencyInfo.displayOn;
      if (displayValueArray && displayValueArray.indexOf(newValue) > -1) {
        this.field.hidden = false;
      } else {
        this.field.hidden = true;
      }
      this.cdr.detectChanges();
      this.formFieldManager.resetFieldValidators(this.field, this.form);
    } else {
      this.logger.logError("mendatory dependency info is not provided in show hide dependency");
      this.logger.logError(res);
    }
  }

  private subscribeParentFieldChanges() {
    this.field.dataChangeObserver = this.handleParentDataChange.bind(this);
  }

  private onChanges(): void {
    this.form.get(this.field.id).valueChanges.subscribe(val => {
      const dependencyInfoList = this.field.dependencyInfo;
      if (!Validations.isNullOrUndefined(dependencyInfoList)) {
        for (const dependentInfo of dependencyInfoList) {
          if (!Validations.isNullOrUndefined(dependentInfo.fieldId)) {
            if (dependentInfo.isGroup) {
              if (dependentInfo.type === "bracketTeamFilling") {
                // custom code for bracket because we should not try to fit 
                // this in generic implementation otherwise it will become unncessarily very complex
                this.executeBracketRelatedDependency(dependentInfo, val);
              } else {
                const groupFieldInfo = this.formFieldManager.getFieldDetails(dependentInfo.groupField);
                if (!Validations.isNullOrUndefined(groupFieldInfo)) {
                  const groupFieldObjInForm = this.form.get(dependentInfo.groupField);
                  let formGroupAr = [];
                  // for the same group field we don't have to get the controls to access formGroups 
                  // below code will only work in case of same group dependency
                  if (Validations.isNullOrUndefined(groupFieldObjInForm)) {
                    formGroupAr = [this.form];
                  } else {
                    formGroupAr = (groupFieldObjInForm as FormArray).controls;
                  }
                  if (!Validations.isNullOrUndefined(formGroupAr) && formGroupAr.length) {
                    for (const singleFormGroup of formGroupAr) {
                      const fieldObject = singleFormGroup.get(dependentInfo.fieldId);
                      if (!Validations.isNullOrUndefined(fieldObject)) {
                        const fieldInfo = this.formFieldManager.getFieldDetailsFromGroup(dependentInfo.fieldId, singleFormGroup.fieldsArray);
                        this.executeDependency(val, fieldInfo, dependentInfo);
                      } else {
                        this.logger.logError("Forms: group child field info is not found/provided in dependency info");
                        this.logger.logError(dependentInfo);
                      }
                    }
                  }
                } else {
                  this.logger.logError("Forms: group field info is not found/provided in dependency info");
                  this.logger.logError(dependentInfo);
                }
              }
            }
            else {
              const fieldInfo = this.formFieldManager.getFieldDetails(dependentInfo.fieldId);
              this.executeDependency(val, fieldInfo, dependentInfo);
            }
          } else if (dependentInfo.type === "action") {
            if (!Validations.isNullOrUndefined(dependentInfo.actionInfo)) {
              this.performActionOnFieldChange(val, dependentInfo.actionInfo)
            } else {
              this.logger.logDebug("Action info is not provided in field dependency type action");
              this.logger.logDebug(dependentInfo);
            }
          }
        }
      }
    });
  }

  private performActionOnFieldChange(newVal: any, action: IActionInfo) {
    let isFileUploadAction = false;
    if (!Validations.isNullOrUndefined(action.doFileUpload) && action.doFileUpload) {
      isFileUploadAction = true;
    }
    const formValueDetails = this.formFieldManager.getFormValues(this.form, isFileUploadAction, action.fileUploadFields);
    // override formValues with new value because we are calling it in on change in form.value is not updated yet
    formValueDetails.formValues[this.field.id] = newVal;
    this.actionDirective.processAction(action, formValueDetails, null, null);
  }

  private executeDependency(newFieldVal: any, fieldInfo: IFormField, dependentInfo: IFormFieldDependencyInfo) {
    if (!Validations.isNullOrUndefined(fieldInfo)) {
      if (!Validations.isNullOrUndefined(fieldInfo.dataChangeObserver)) {
        const responseData: any = {};
        responseData.type = dependentInfo.type;
        responseData.params = {};
        newFieldVal = this.formFieldManager.getFieldValueBasedOnType(newFieldVal, this.field);
        if (!Validations.isNullOrUndefined(newFieldVal)) {
          responseData.params[this.field.id] = newFieldVal;
          responseData.dependencyInfo = dependentInfo;
          fieldInfo.dataChangeObserver(responseData, newFieldVal);
        } else {
          this.logger.logError("field value is not valid to call dependency action");
          this.logger.logError(newFieldVal);
          this.logger.logError(this.field);
        }
      }
    }
    else {
      this.logger.logError("field info is not found provided dependency info");
      this.logger.logError(dependentInfo);
    }
  }


  private executeBracketRelatedDependency(dependentInfo: IFormFieldDependencyInfo, newFieldVal: any) {
    const groupFieldInfo = this.formFieldManager.getFieldDetails(dependentInfo.groupField);
    const sourceGroupFieldInfo = this.formFieldManager.getFieldDetails(dependentInfo.sourceGroup);
    if (!Validations.isNullOrUndefined(groupFieldInfo) && !Validations.isNullOrUndefined(sourceGroupFieldInfo)) {
      const fieldOptionsToAdd = sourceGroupFieldInfo.groupFieldOptionsProvider(this.field.id, newFieldVal);
      const responseData: any = {};
      responseData.type = "addOptionsInGroupField";
      responseData.params = {};
      responseData.params["optionsToAdd"] = fieldOptionsToAdd;
      responseData.params["fieldIds"] = dependentInfo.bracketFieldIds;
      responseData.params["valueMatcher"] = "Team " + (this.indexInGroup + 1); // will be used to fill teams in score selection as soon you choose teams
      responseData.params["valueToSet"] = newFieldVal; // will be used to fill teams in score selection as soon you choose teams
      groupFieldInfo.dataChangeObserver(responseData, newFieldVal);
    } else {
      this.logger.logError("Forms: Group field info not found in executeBracketRelatedDependency");
      this.logger.logError(dependentInfo);
    }
  }

  private handleErrorOnFieldDataLoad(err) {
    this.logger.logError("Fail to load data in field due to error");
    this.logger.logError(err);
    this.logger.logError(this.field);
  }

  private loadDataInField(appData: AppDataParent, actionInfo: IActionInfo) {
    if (!Validations.isNullOrUndefined(appData)) {
      if (!Validations.isNullOrUndefined(actionInfo) && !Validations.isNullOrUndefined(actionInfo.otherDetails)) {
        const fieldId = actionInfo.otherDetails.fieldId;
        const fieldRawData = appData.getRawData();
        this.setDataInField(fieldId, fieldRawData.data);
      } else {
        this.handleErrorOnFieldDataLoad("Dataprovider key was not valid");
      }
    } else {
      this.logger.logError("App data in loadDataInField is not valid for field");
      this.logger.logError(this.field);
    }
  }

  private setDataInField(fieldId: string, data: any) {
    switch (this.field.type) {
      case "text":
        const formField = this.form.get(fieldId) as FormControl;
        formField.setValue(data);
        break;
      case "dropdown":
        this.field.options = this.formFieldManager.prepareOptionsForDropDown(data);
        break;
      case "autoComplete":
        this.field.options = this.formFieldManager.prepareOptionsForDropDown(data);
        break;
      case "group":
        this.field.groupFieldLoader(data);
        break;
    }
  }


}
