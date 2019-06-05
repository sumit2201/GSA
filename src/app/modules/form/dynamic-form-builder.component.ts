import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";
import { IActionInfo, IAppFormFieldDetail, IFormConfig, IFormSchema, IActionHanldeResponse, IActionResponse, IFormField } from "../../common/interfaces";
import { Validations } from "src/app/common/utility";
import { LoggerService } from "../architecture-module/services/log-provider.service";
import { ActionExecutorService } from "../../services/data-provider.service";
import { Observable } from "rxjs/Rx";
import { AppDataParent } from "../../common/app-data-format";
import { FormFieldManager } from "../../services/form-field-manager";
import { Globals } from "../../services/global";

@Component({
  selector: "dynamic-form-builder",
  templateUrl: "./dynamic-form-builder.template.html",
  styleUrls: ["./dynamic-form-builder.style.scss"],
  providers: [FormFieldManager]
})
export class DynamicFormBuilderComponent implements OnInit {
  @Output() public onSubmit = new EventEmitter();
  @Output() public onActionSuccess = new EventEmitter();
  @Input() public schema: IFormSchema;
  public fields: IFormField[] = [];
  public actions: IActionInfo[] = [];
  @Input() public loadDataProvider: IActionInfo;
  @Input() public formConfig: IFormConfig;
  private isAllFieldLoadComplete: boolean;
  public form: FormGroup;
  public isRowLayout: boolean = false;
  public submitOnLoad: boolean = false;
  public formSubmittedByUser: boolean = false;
  public actionCompleteResponse: IActionResponse;
  constructor(private formFieldManager: FormFieldManager,
    private logger: LoggerService,
    private actionProviderService: ActionExecutorService,
    private cdr: ChangeDetectorRef, private globals: Globals
  ) {
    this.isAllFieldLoadComplete = false;
  }

  public ngOnInit() {
    this.checkAndloadAllFieldData();
  }

  public initiateFormRendering(formData?: any) {
    this.setFormFields();
    this.formFieldManager.prepareNameWiseFields(this.fields);
    let fieldsCtrls = {};
    for (let f of this.fields) {
      if (!Validations.isNullOrUndefined(formData) && !Validations.isNullOrUndefined(formData[f.id])) {
        f.valueToSet = formData[f.id];
      }
      if (f.type === 'group') {
        const field_id = f.id;
        fieldsCtrls[f.id] = this.formFieldManager.createFormArrayControl(f);
      } else {
        fieldsCtrls[f.id] = this.formFieldManager.createFormControl(f);
      }
    }
    this.form = new FormGroup(fieldsCtrls);
    this.formFieldManager.setFormValueProvider(this.getFormValues.bind(this));
    this.setSubmitStatus();
    this.setRegistrationFormValidator();
  }

  get isValid() {
    if (!Validations.isNullOrUndefined(this.form.errors) && !Validations.isNullOrUndefined(this.form.errors.passwordNotSame)) {
      return false;
    }
    return true;
  }

  get errorMessage() {
    let msg = null;
    if (!Validations.isNullOrUndefined(this.form.errors) && !Validations.isNullOrUndefined(this.form.errors.passwordNotSame)) {
      msg = " Password and confirm password do not match";
    }
    return msg;
  }
  public getFormValues() {
    return this.form.value;
  }

  public handleActionSuccess(eventData) {
    console.error("handle action success");
    this.onActionSuccess.emit(eventData);
  }

  public getCustomClassName() {
    if (!Validations.isNullOrUndefined(this.formConfig) && !Validations.isNullOrUndefined(this.formConfig.customClass)) {
      return this.formConfig.customClass;
    }
    return "";
  }

  public handleActionSubmitByUser() {
    this.formSubmittedByUser = true;
    this.cdr.detectChanges();
  }

  public handleActionFailure(actionResponse) {
    if (!Validations.isNullOrUndefined(actionResponse) && actionResponse) {
      this.actionCompleteResponse = actionResponse;
      this.actionCompleteResponse.status;
      if (this.actionCompleteResponse.status == 0) {
        if (!Validations.isNullOrUndefined(this.actionCompleteResponse.errorMessage)) {
          alert(this.actionCompleteResponse.errorMessage);
        }

      }
    }
  }

  // can be called as hard coding or specific code for registration form
  public checkPasswords() {
    let pass = this.form.controls["password"].value;
    let confirmPass = this.form.controls["confirmpassword"].value;
    if (pass && confirmPass) {
      return pass === confirmPass ? null : { passwordNotSame: true }
    }
    return null;
  }

  private setRegistrationFormValidator() {
    if (!Validations.isNullOrUndefined(this.formConfig) && !Validations.isNullOrUndefined(this.formConfig.isRegistrationForm)) {
      this.form.setValidators(this.checkPasswords.bind(this));
    }
  }

  private setSubmitStatus() {
    if (!Validations.isNullOrUndefined(this.formConfig) && !Validations.isNullOrUndefined(this.formConfig.submitOnLoad)) {
      this.submitOnLoad = this.formConfig.submitOnLoad;
    } else {
      this.submitOnLoad = false;
    }
  }

  private setFormFields() {
    if (!Validations.isNullOrUndefined(this.schema.fields)) {
      this.fields = this.schema.fields;
    } else if (Validations.isNullOrUndefined(this.schema.fields) && !Validations.isNullOrUndefined(this.schema.rows)) {
      let fields = [];
      this.isRowLayout = true;
      for (const rows of this.schema.rows) {
        fields = fields.concat(rows.fields);
      }
      this.fields = fields;
      // we will change the form schema so that state, sport & other multi site 
      // dependent fields can be hidden from user or can have less options to chosse
      this.updateFormDetailsAsPerGlobals(this.fields);
    }
  }

  private updateFormDetailsAsPerGlobals(fields: IFormField[]) {
    if (!Validations.isNullOrUndefined(fields) && fields.length) {
      for (const fieldObj of fields) {
        // can 
        if (Validations.isNullOrUndefined(fieldObj.globalSettingField)) {
          fieldObj.globalSettingField = null;
        }
        if (fieldObj.id === "sportId" || fieldObj.globalSettingField === "sportIds") {
          const sportValues = this.globals.siteGlobals.sportValues;
          if (!Validations.isNullOrUndefined(sportValues) && sportValues.length) {
            if (sportValues.length === 1) {
              fieldObj.hidden = true;
              fieldObj.valueToSet = sportValues[0].id;
            }
            fieldObj.options = this.formFieldManager.prepareOptionsForDropDown(sportValues);
            fieldObj.dataProvider = null;
          }
        }
        if (fieldObj.id === "state" || fieldObj.globalSettingField === "states") {
          const stateValues = this.globals.siteGlobals.stateValues;
          if (!Validations.isNullOrUndefined(stateValues) && stateValues.length) {
            if (stateValues.length === 1) {
              fieldObj.hidden = true;
              fieldObj.valueToSet = stateValues[0].id;
            }
            fieldObj.options = this.formFieldManager.prepareOptionsForDropDown(stateValues);
            fieldObj.dataProvider = null;
          }
        }
      }
    }
  }

  private checkAndloadAllFieldData() {
    this.handleAllFieldLoadComplete();
  }

  private handleAllFieldLoadComplete() {
    if (!Validations.isNullOrUndefined(this.loadDataProvider) && !Validations.isObjectEmpty(this.loadDataProvider)) {
      this.actionProviderService.performAction(this.loadDataProvider).subscribe(
        (res: IActionHanldeResponse) => {
          this.logger.logInfo("Forms: data load response");
          const resData = res.data;
          this.logger.logInfo(res);
          this.initiateFormRendering(resData.getRawData().data);
        },
        (err) => {
          this.logger.logError("Forms: Error in loading form data");
          this.logger.logError(err);
          // TODO: Show message to user with reload option
          this.initiateFormRendering();
        }
      );
    } else {
      this.initiateFormRendering();
    }
  }

  private handleOnLoadActionResponse(res: any) {
    for (let f of this.fields) {
      const formControlObj = this.form.get(f.name);
      if (!Validations.isNullOrUndefined(res[f.name])) {
        formControlObj.setValue(res[f.name]);
      }
    }
  }

  private checkAndLoadAllFieldData() {

  }
}
