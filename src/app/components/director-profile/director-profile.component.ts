import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from 'src/app/modules/architecture-module/services/log-provider.service';
import { Globals } from 'src/app/services/global';
import { AccessProviderService } from 'src/app/services/access-provider';
import { Validations } from 'src/app/common/utility';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-director-profile',
  templateUrl: './director-profile.component.html',
  styleUrls: ['./director-profile.component.scss']
})
export class DirectorProfileComponent implements OnInit {
  @Input() public userData: any;
  public widgets: any;
  adminLinks: any[];

  constructor(private logger: LoggerService,
    private globals: Globals,
    private accessProvider: AccessProviderService) { }

  ngOnInit() {
    this.logger.logDebug("common user profile");
    const widgetObserver = this.globals.getWidgetList("user");
    if (!Validations.isNullOrUndefined(widgetObserver)) {
      Observable.forkJoin(widgetObserver).subscribe((data: any) => {
        this.widgets = data[0];
      }, () => {
        console.error("error occured");
      });
    }
    this.prepareAdminLinks();    
  }

  public getUserProfileImage() {
    if (!Validations.isNullOrUndefined(this.userData.profileImage) && this.userData.profileImage != "") {
      const imageDirectory = this.globals.getUserProfilePath(this.userData.id);
      return imageDirectory + "/" + this.userData.profileImage;
    } else {
      return this.globals.getDefaultUserProfileImage();
    }
  }

  public prepareAdminLinks() {
    const adminLinks = this.globals.prepareActionLinks("user");
    if (adminLinks.length) {
      this.adminLinks = adminLinks;
    }
  }

  public getUserRelatedParameters() {
    const values = {
      userId: this.userData.userId,
    };
    return {
      formValues: values,
      fileValues: null
    }
  }


  public canHaveTournamentsOnProfile() {
    return this.userData.isDirector || this.userData.isSuperAdmin;
  }

  public canViewTeamContact() {
    return this.accessProvider.canViewTeamContact();
  }

  public canUpdateUserProfile() {
    return this.accessProvider.canUpdateUser(this.userData);
  }

}

