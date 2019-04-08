import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validations } from '../../../../common/utility';
import { IFormPlainTextField, IActionInfo } from '../../../../common/interfaces';
import { ActionExecutorDirective } from '../../../../directives/action-executor.directive';
import { LoggerService } from '../../../architecture-module/services/log-provider.service';

@Component({
  selector: 'plain-text-input',
  templateUrl: './plain-text-input.component.html',
  styleUrls: ['./plain-text-input.component.scss']
})
export class PlainTextInputComponent implements OnInit {
  @Input() public field: any;
  @Input() public form: FormGroup;
  @Input() public parameterValueProvider: any;
  public plainFieldData: IFormPlainTextField[];
  get isValid() { return true }
  get isDirty() { return false; }
  constructor(private actionDirective: ActionExecutorDirective, private logger: LoggerService) { }

  ngOnInit() {
    if (!Validations.isNullOrUndefined(this.field)) {
      if (!Validations.isArray(this.field)) {
        this.plainFieldData = [this.field];
      } else {
        this.plainFieldData = this.field;
      }
    }
  }

  public performActionFromBtn(action: IActionInfo) {
    // let isFileUploadAction = false;
    // if (!Validations.isNullOrUndefined(action.doFileUpload) && action.doFileUpload) {
    //   isFileUploadAction = true;
    // }
    if (!Validations.isNullOrUndefined(this.parameterValueProvider)) {
      const formValueDetails = this.parameterValueProvider();
      this.actionDirective.processAction(action, formValueDetails, null, null);
    } else {
      this.logger.logDebug("parameter values is not provided in action in plain text field");
      this.logger.logDebug(this.field);
    }
  }
}