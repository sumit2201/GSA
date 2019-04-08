import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { IActionInfo, IActionResponse, IWidgetInfo, IActionHanldeResponse, ActionResponseHandlingTypes } from "../../../../common/interfaces";
import { ActionExecutorService } from "../../../../services/data-provider.service";
import { AppDataParent } from "../../../../common/app-data-format";
import { LoggerService } from "../../../architecture-module/services/log-provider.service";
import { Validations, TimeUtils } from "../../../../common/utility";
import { FormFieldManager } from "../../../../services/form-field-manager";
import { DEFAULT_ERROR_MSG_OF_ACTION_RESPONSE } from "../../../../common/constants";
import { ActionExecutorDirective } from "../../../../directives/action-executor.directive";

@Component({
  selector: "action-button",
  templateUrl: "./button-input.template.html",
})

export class ActionButtonComponent implements OnInit, AfterViewInit {
  @Input() public action: IActionInfo = null;
  @Input() public form: FormGroup;
  @Input() public submitOnLoad: boolean;
  @Input() public formSubmissionSetter: any;
  // @ViewChild(ActionExecutorDirective) actionDirective: ActionExecutorDirective;
  public actionResponse: IActionResponse;

  constructor(private actionDirective: ActionExecutorDirective,
    private dataProviderService: ActionExecutorService,
    private logger: LoggerService, private formFieldManager: FormFieldManager) {
    // TODO;
  }

  public ngOnInit() {
    // if (this.submitOnLoad) {
    //   this.performActionFromBtn(this.action);
    // }
  }

  public ngAfterViewInit() {
    if (this.submitOnLoad) {
      this.performActionFromBtn(this.action);
    }
  }


  public performActionFromBtn(action: IActionInfo) {
    if (this.isFormValid()) {
      // if (action.id === "fetchranking") {
      //   this.printContent();
      // }
      let isFileUploadAction = false;
      if (!Validations.isNullOrUndefined(action.doFileUpload) && action.doFileUpload) {
        isFileUploadAction = true;
      }
      const formValueDetails = this.formFieldManager.getFormValues(this.form, isFileUploadAction, action.fileUploadFields);
      this.actionDirective.processAction(action, formValueDetails, null, null);
    }
  }

  private printContent() {
    const printContent = document.getElementById("gsa-app");
    const WindowPrt = window.open('http://gsateamslocal.com/team-profile/23532', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.innerHTML);
    // WindowPrt.document.close();
    setTimeout(() => {
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
    }, 5000);
  }


  private updateGroupFieldValues() {
    const currentVal = this.form.value;
    if (!Validations.isNullOrUndefined(currentVal)) {
      for (const fieldId in currentVal) {
        if (currentVal.hasOwnProperty(fieldId)) {
          const valueOfField = currentVal[fieldId];
          if (Validations.isArray(valueOfField)) {
            const fieldObj = this.form.get(fieldId) as FormArray;
            if (!Validations.isNullOrUndefined(fieldObj) && fieldObj.controls) {
              const newFieldValues = [];
              for (const formGroupOfControl of fieldObj.controls) {
                const fieldValueObj = {};
                for (const subFieldId in (formGroupOfControl as FormArray).controls) {
                  if ((formGroupOfControl as FormArray).controls.hasOwnProperty(subFieldId)) {
                    fieldValueObj[subFieldId] = formGroupOfControl.get(subFieldId).value;
                    formGroupOfControl.get(subFieldId).setValue(fieldValueObj[subFieldId], { emitEvent: false });
                  }
                }
                newFieldValues.push(fieldValueObj);
              }
              currentVal[fieldId] = newFieldValues;
            }
          } else if (Validations.isNullOrUndefined(valueOfField)) {
            currentVal[fieldId] = "";
          }
        }
      }
      this.form.setValue(currentVal, { emitEvent: false });
    }

  }

  private isFormValid() {
    this.updateGroupFieldValues();
    if (!Validations.isNullOrUndefined(this.formSubmissionSetter)) {
      this.formSubmissionSetter(true);
    }
    return this.form.valid;
  }



}
