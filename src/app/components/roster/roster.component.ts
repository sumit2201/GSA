import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from 'src/app/common/app-data-format';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.logger.logDebug("data in roster component");
    this.logger.logDebug(this.widgetData);
  }

}
