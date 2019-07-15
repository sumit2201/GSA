import { Component, OnInit, Input } from '@angular/core';
import { AppDataParent } from 'src/app/common/app-data-format';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'app-shortlist',
  templateUrl: './shortlist.component.html',
  styleUrls: ['./shortlist.component.scss']
})
export class ShortlistComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  constructor(
    private logger: LoggerService,
    private global: Globals,
  ) { }

  ngOnInit() {
    console.error("data recieved in component");
    console.error(this.widgetData);
  }

}
