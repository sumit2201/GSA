import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  @Input() public userData: any;

  constructor(private logger: LoggerService) { }

  ngOnInit() {
    this.logger.logDebug("admin profile");
  }

}
