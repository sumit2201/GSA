import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Validations } from '../../common/utility';
import { HttpClient } from '@angular/common/http';
import { ActionExecutorService } from '../../services/data-provider.service';
import { PrintBracketAction, HideUnHideBracketAction } from '../../../config/static-widget-info';
import { AccessProviderService } from '../../services/access-provider';

@Component({
  selector: 'app-view-bracket',
  templateUrl: './view-single-bracket.component.html',
  styleUrls: ['./view-single-bracket.component.scss']
})
export class ViewSingleBracketComponent implements OnInit {
  public widgetData: AppDataParent;
  public bracketDetails: any;
  public isHidden:boolean;
  constructor(private logger: LoggerService, private actionExecutor: ActionExecutorService, private cdr: ChangeDetectorRef, private acceessProvider: AccessProviderService ) { }

  ngOnInit() {
    this.prepareBracketData();
    this.logger.logDebug("data in view bracket");
    this.logger.logDebug(this.widgetData);
  }

  public getDirectorInfo() {
    return 'Director - ' + this.bracketDetails.directorInfo.name + ' - ' + this.bracketDetails.directorInfo.primary;
  }

  public prepareBracketData() {
    if (!Validations.isNullOrUndefined(this.widgetData) && this.widgetData.hasValidRawData()) {
      const rawData = this.widgetData.getRawData();
      this.bracketDetails = rawData.data;
      this.isHidden = this.bracketDetails.isHidden;
    }
  }

  public printBracket() {
    const parameters = this.prepareParameterForBracket();
    this.actionExecutor.performAction(PrintBracketAction, parameters).subscribe((res: any) => {
      if (!Validations.isNullOrUndefined(res.data) && res.data.hasValidRawData()) {
        var WindowObject = window.open("", "PrintWindow", "location=1,status=1,scrollbars=1, width=850,height=900");
        WindowObject.document.writeln("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
        WindowObject.document.writeln("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://gsaserver.com/public/styles/bracket_print.css\" />");
        WindowObject.document.writeln("</head>\<body style=\"font-family: Verdana, Arial, Helvetica, sans-serif;\">");
        WindowObject.document.writeln(res.data.getRawData().data);
        WindowObject.document.writeln("</body></html>");
        WindowObject.document.close();
        $(WindowObject.document).ready(function () {
          //set this timeout longer if you have many resources to load
          setTimeout(function () {
            WindowObject.focus();
            WindowObject.print();
          }, 1000)
        });
      }
    });
  }

  public hideBracket() {
    const params: any = this.prepareParameterForBracket();
    params.isHidden = true;
    this.hideUnhideBracket(params);
  }

  public unHideBracket() {
    const params: any = this.prepareParameterForBracket();
    params.isHidden = false;
    this.hideUnhideBracket(params);
  }

  public hideUnhideBracket(parameters: any) {
    this.actionExecutor.performAction(HideUnHideBracketAction, parameters).subscribe((res: any) => {
      if (this.actionExecutor.isValidActionResponse(res)) {
          this.bracketDetails.isHidden  = res.payload.isHidden;
          this.isHidden = this.bracketDetails.isHidden;
      } else {
        this.actionExecutor.alertErrorInCaseOfFailure(res);
      }
    }, (err) => {
      console.error(err);
      this.logger.logError("Error occured in setting bracket state");
      this.logger.logError(this.bracketDetails);
    });

  }

  public prepareParameterForBracket() {
    if (!Validations.isNullOrUndefined(this.bracketDetails)) {
      return {
        tournamentId: this.bracketDetails.tournament_id,
        bracketId: this.bracketDetails.id
      }
    }
  }
}
