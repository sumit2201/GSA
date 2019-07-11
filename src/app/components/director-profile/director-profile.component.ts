import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';

@Component({
  selector: 'app-director-profile',
  templateUrl: './director-profile.component.html',
  styleUrls: ['./director-profile.component.scss']
})
export class DirectorProfileComponent implements OnInit {
  @Input() public userData: any;
 
  constructor( 
    public logger: LoggerService,
  ) { }

  ngOnInit() {
    this.logger.logDebug("director profile");
    this.logger.logDebug(this.userData);
  }

}
