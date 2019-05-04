import { Component, OnInit } from '@angular/core';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Validations } from '../../common/utility';
import { HttpClient } from '@angular/common/http';
import { ActionExecutorService } from '../../services/data-provider.service';
import { PrintBracketAction } from '../../../config/static-widget-info';

@Component({
  selector: 'app-view-bracket',
  templateUrl: './view-bracket.component.html',
  styleUrls: ['./view-bracket.component.scss']
})
export class ViewBracketComponent implements OnInit {
  public widgetData: AppDataParent;
  public bracketDetails: any;
  constructor(private logger: LoggerService, private actionExecutor: ActionExecutorService) { }

  ngOnInit() {
    this.prepareBracketData();
    this.logger.logDebug("data in view bracket");
    this.logger.logDebug(this.widgetData);
  }

  public getDirectorInfo() {
    return 'Director - ' + this.bracketDetails.directorInfo.name + ' - ' + this.bracketDetails.directorInfo.contactno;
  }

  public prepareBracketData() {
    if (!Validations.isNullOrUndefined(this.widgetData) && this.widgetData.hasValidRawData()) {
      const rawData = this.widgetData.getRawData();
      this.bracketDetails = rawData.data;
    }
  }

  public printBracket() {
    const bracketId = this.bracketDetails.id;
    const tournamentId = this.bracketDetails.tournament_id
    // const url = "http://gsateamslocal.com/printBracket/2503/3627";
    this.actionExecutor.performAction(PrintBracketAction).subscribe((res: any) => {
      if (!Validations.isNullOrUndefined(res.data) && res.data.hasValidRawData()) {
        var WindowObject = window.open("", "PrintWindow", "location=1,status=1,scrollbars=1, width=850,height=900");
        WindowObject.document.writeln("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
        WindowObject.document.writeln("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://gsa.technideus.com/public/styles/bracket_print.css\" />");
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
}
