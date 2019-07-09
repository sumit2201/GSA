import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from 'src/app/common/app-data-format';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';

@Component({
  selector: 'app-alert',
  templateUrl: './app-alert.component.html',
  styleUrls: ['./app-alert.component.scss']
})
export class AppAlertComponent implements OnInit {
  @Input() public message: string;
  @Input() public type: string;
  public isClosed = false;
  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.logger.logDebug("app-alert");
    this.logger.logDebug(this.message);
    this.isClosed = false;
  }
  public getClass() {
    let className;
    switch (this.type) {
      case "error":
        className = "alert-error";
        break;
      case "success":
        className = "alert-success";
        break;
      case "warning":
        className = "alert-warning";
        break;
    }
    return "alert " + className;
  }

  public closeMessage(){
    this.isClosed = true;
  }

}
