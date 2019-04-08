import { Directive, Input, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { IActionInfo, IParameterValueFormat, IDialogueData, IActionHanldeResponse } from '../common/interfaces';
import { ActionExecutorService } from '../services/data-provider.service';
import { Validations } from '../common/utility';
import { MatDialog } from '@angular/material';
import { AppDialogueComponent } from '../components/app-dialogue/app-dialogue.component';
import { DEFAULT_ERROR_MSG_OF_ACTION_RESPONSE } from '../common/constants';
import { LoggerService } from '../modules/architecture-module/services/log-provider.service';

@Directive({
  selector: '[action-executor]',
})
export class ActionExecutorDirective implements OnInit {

  @Output() public onActionFailure = new EventEmitter();
  @Output() public onActionSuccess = new EventEmitter();

  constructor(private actionExecutorService: ActionExecutorService,
    public dialog: MatDialog, private logger: LoggerService) { }
  public ngOnInit() {
    // TODO:
  }

  // @HostListener('click') onClick() {
  //   if (!Validations.isNullOrUndefined(this.parameterValueProvider)) {
  //     this.parameterValues = this.parameterValueProvider(this.dataItem);
  //   }
  //   if (this.isConfirmationRequired(this.actionInfo)) {
  //     const dailogueData = this.prepareDialogueData(this.actionInfo);
  //     this.openDialog(dailogueData);
  //   } else {
  //     this.processAction(this.actionInfo, this.parameterValues, this.metaType, this.transformationType);
  //   }
  // }

  private isConfirmationRequired(actionInfo: IActionInfo) {
    if (!Validations.isNullOrUndefined(actionInfo.context) && actionInfo.context === "delete") {
      return true;
    } else {
      return false;
    }
  }

  private prepareDialogueData(actionInfo: IActionInfo) {
    return {
      title: "Warning",
      text: "Are you sure, you want to delete ?"
    }
  }

  private openDialog(dailogueData: IDialogueData) {
    const dialogRef = this.dialog.open(AppDialogueComponent, {
      width: '250px',
      data: dailogueData,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    //   if (result) {
    //     this.processAction(this.actionInfo, this.parameterValues, this.metaType, this.transformationType);
    //   }
    // });
  }

  public processAction(action: IActionInfo, formValueDetails: any, metaType?: string, transformationType?: string) {
    let isFileUploadAction = false;
    if (!Validations.isNullOrUndefined(action.doFileUpload) && action.doFileUpload) {
      isFileUploadAction = true;
    }
    const dataLoadObserver = this.actionExecutorService.performAction(action, formValueDetails.formValues, null, null, formValueDetails.fileValues);
    dataLoadObserver.subscribe(
      (res: IActionHanldeResponse) => {
        this.logger.logInfo("Handle action response from form button");
        this.logger.logInfo(res);
        if (res.status === 1) {
          res.paramValues = formValueDetails.formValues
          this.onActionSuccess.emit(res);
        } else {
          this.handleActionFailureResponse(res);
        }
      },
      err => {
        // console
        this.logger.logError("Error in calling action from form button");
        this.logger.logError(err);
      }
    )
  }

  private handleActionFailureResponse(res: IActionHanldeResponse) {
    if (Validations.isNullOrUndefined(res.erroMessage) || res.erroMessage.trim() === "") {
      res.erroMessage = DEFAULT_ERROR_MSG_OF_ACTION_RESPONSE;
    }
    this.onActionFailure.emit(res as any);
  }

}
