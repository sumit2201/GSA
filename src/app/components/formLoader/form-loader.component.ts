import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../services/global";
import { Validations } from "../../common/utility";
import { AppFormData, AppDataParent } from "../../common/app-data-format";
import { IActionInfo, IFormField } from "../../common/interfaces";
import { LoggerService } from "../../modules/architecture-module/services/log-provider.service";
import { EventTypes } from "../../common/constants";
import { FormFieldManager } from "../../services/form-field-manager";

@Component({
  templateUrl: "./form-loader.template.html",
})
export class FormLoaderComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public widgetFormData: AppFormData;
  public onEventEmit: any;
  constructor(
    public route: ActivatedRoute, private globals: Globals,
    private global: Globals, private logger: LoggerService, private formFieldManager: FormFieldManager
  ) {
  }

  public ngOnInit() {
    this.setFormDetails();
  }

  public onSubmit(formData: any) {
    console.error("form data is", formData);
  }

  public handleActionSuccess(eventData: any) {
    if (!Validations.isNullOrUndefined(this.onEventEmit)) {
      this.onEventEmit(EventTypes.ACTION_SUCCESS, eventData);
    }
    console.error("handle action success");
  }

  public handleActionFailure(eventData: any) {
    if (!Validations.isNullOrUndefined(this.onEventEmit)) {
      this.onEventEmit(EventTypes.ACTION_FAILURE, eventData);
    }
    console.error("handle action failure");
  }

  

  private setFormDetails() {
    let widgetFormData = (this.widgetData.getRawData().data) as AppFormData;
    if (Validations.isNullOrUndefined(widgetFormData)) {
      widgetFormData = new AppFormData();
      widgetFormData.schema = {};
      widgetFormData.formDataProvider = {};
      widgetFormData.formDataParameters = {};
      widgetFormData.formConfig = {};
    } else {
      if (Validations.isNullOrUndefined(widgetFormData.schema)) {
        widgetFormData.schema = {};
      }
      if (Validations.isNullOrUndefined(widgetFormData.formDataProvider)) {
        widgetFormData.formDataProvider = {};
      }
      if (Validations.isNullOrUndefined(widgetFormData.formConfig)) {
        widgetFormData.formConfig = {};
      }
      if (Validations.isNullOrUndefined(widgetFormData.formDataParameters)) {
        widgetFormData.formDataParameters = {};
      }
    }
   this.widgetFormData = widgetFormData;
  }


}
