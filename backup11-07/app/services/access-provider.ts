import { Injectable } from "@angular/core";
import { Globals } from "./global";
import { Validations } from "../common/utility";
import { LoggerService } from "../modules/architecture-module/services/log-provider.service";
import { AppFeatures } from "../common/constants";

@Injectable()
export class AccessProviderService {
  constructor(private logget: LoggerService, private global: Globals) {

  }

  public isSuperAdmin() {
    const userValue = this.global.currentUserValue;
    if (!Validations.isNullOrUndefined(userValue) && userValue.isSuperAdmin) {
      return true;
    }
    return false;
  }

  public isDirector() {
    const userValue = this.global.currentUserValue;
    if (!Validations.isNullOrUndefined(userValue) && userValue.isDirector) {
      return true;
    }
    return false;
  }

  public isLoggedIn() {
    return this.global.isUserLoggedIn();
  }

  public canViewTeamContact(){
    return this.isSuperAdmin() || this.isDirector();
  }

  public canUpdateTournaments(){
    return this.isSuperAdmin() || this.isDirector();
  }
  
  public canUpdateUser(userData) {
    if (this.isLoggedIn()) {
      if (this.isSuperAdmin()) {
        return true;
      } else if (!Validations.isNullOrUndefined(userData) && userData.id === this.global.currentUserValue.userId) {
        return true;
      }
    }
  }

  public canUpdateTeam(teamData) {
    if (this.isSuperAdmin() || this.isDirector()) {
      return true;
    } else if (!Validations.isNullOrUndefined(teamData) && !Validations.isNullOrUndefined(teamData.ownershipDetails)) {
      if (teamData.ownershipDetails.isOwner) {
        return true;
      }
    }
    return false;
  }

  public canUpdateTournament(tournamentData) {
    if (this.isSuperAdmin() || this.isDirector()) {
      return true;
    } else if (!Validations.isNullOrUndefined(tournamentData) && !Validations.isNullOrUndefined(tournamentData.ownershipDetails)) {
      if (tournamentData.ownershipDetails.isOwner) {
        return true;
      }
    }
    return false;
  }

  public hasAccess(feature: string, $data?: any) {
    if (this.isSuperAdmin()) {
      return true;
    }
    const currentAvailableFeatureList = this.global.getAvailableFeatures();
    let isAllowed = false;
    if (!Validations.isNullOrUndefined(feature)) {
      if (currentAvailableFeatureList.indexOf(feature.toLowerCase()) > -1) {
        isAllowed = true;
      }
    }
    return isAllowed;
  }

}