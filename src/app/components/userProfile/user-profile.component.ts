import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInfo, IFormPlainTextField } from '../../common/interfaces';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../services/global';
import { WidgetProviderService } from '../../services/widget-provider.service';
import { StorageService } from '../../services/storage';
import { Validations } from '../../common/utility';
import { Observable } from 'rxjs';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { MatTabChangeEvent } from '@angular/material';
import { AccessProviderService } from '../../services/access-provider';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() public widgetData: AppDataParent;
  public widgets: { [key: string]: IWidgetInfo };
  public parameters: { [key: string]: string };
  public userData: any;
  public adminLinks: IFormPlainTextField[];
  constructor(
    public logger: LoggerService,
    private globals: Globals,
    private storage: StorageService,
    private accessProvider: AccessProviderService
  ) {
  }

  public ngOnInit() {
    this.prepareUserData();
    const widgetObserver = this.globals.getWidgetList("user");
    if (!Validations.isNullOrUndefined(widgetObserver)) {
      Observable.forkJoin(widgetObserver).subscribe((data: any) => {
        this.widgets = data[0];
      }, () => {
        console.error("error occured");
      });
    }
  }

  public getUserProfileImage() {
    if (!Validations.isNullOrUndefined(this.userData.profileImage) && this.userData.profileImage != "") {
      const imageDirectory = this.globals.getUserProfilePath(this.userData.id);
      return imageDirectory + "/" + this.userData.profileImage;
    } else {
      return this.globals.getDefaultUserProfileImage();
    }
  }

  public prepareUserData() {
    this.userData = {};
    if (!Validations.isNullOrUndefined(this.widgetData) && !Validations.isNullOrUndefined(this.widgetData.getRawData())) {
      const rawData = this.widgetData.getRawData();
      if (!Validations.isNullOrUndefined(rawData.data) && rawData.data.length) {
        this.userData = rawData.data[0];
        this.prepareAdminLinks();
      } else {
        this.logger.logDebug("widget raw data is not valid in user profile");
        this.logger.logDebug(this.widgetData);
      }
    } else {
      this.logger.logDebug("widget data is not valid in user profile");
      this.logger.logDebug(this.widgetData);
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


  // ngx datatable has issue on resize in tabs to fix this we are
  // dispatching events
  public onTabChange(event: MatTabChangeEvent) {
    window.dispatchEvent(new Event('resize'));
  }

  public canUpdateUserProfile() {
    return this.accessProvider.canUpdateUser(this.userData);
  }

  public canViewTeamContact(){
    return this.accessProvider.canViewTeamContact();
  }

  public canHaveTournamentsOnProfile(){
    return this.userData.isDirector || this.userData.isSuperAdmin;
  }

}
