import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/services/global';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';
import { AppDataParent } from '../../common/app-data-format';

@Component({
  selector: 'app-text-viewer',
  templateUrl: './text-viewer.component.html',
  styleUrls: ['./text-viewer.component.scss']
})
export class TextViewerComponent implements OnInit {
  public widgetData: AppDataParent;
  public contentToShow: any;
  constructor(private global: Globals, private logger: LoggerService) { }

  ngOnInit() {
    this.logger.logInfo("data recieved on text viewer widget");
    this.logger.logError(this.widgetData);
    this.contentToShow = this.widgetData.getRawData().data.content;
  }

}
