// globals.tse
import { Injectable } from "@angular/core";
import { IActionInfo, IUserDetails, IRoundtripActionInfo, IActionResponse, IActionHanldeResponse, IGlobalSettings, IClientGlobals, IFormPlainTextField } from "../common/interfaces";
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { AppConstants } from "../common/api-urls";
import { Validations } from "../common/utility";
import { STATICWIDGETS } from "src/config/static-widget-info";
import { LoggerService } from "../modules/architecture-module/services/log-provider.service";
import { StorageService } from "./storage";
import { WebPagesNameConst } from "../common/constants";
import { TEAMPROFILEWIDGETS, TeamEditActions } from "../../config/team-profile.widgets";
import { USERPROFILEWIDGETS, UserEditActions } from "../../config/user-profile.widgets";
import { TOURNAMENTPROFILEWIDGETS } from "../../config/tournament-profile.widgets";
import { PlatformLocation } from '@angular/common';
import { Router } from "@angular/router";

@Injectable()
export class Globals {
    private currentUserSubject: BehaviorSubject<IUserDetails>;
    public siteGlobals: IGlobalSettings;
    public clientGlobals: IClientGlobals;
    public currentUser: Observable<IUserDetails>;

    constructor(private http: HttpClient, private logger: LoggerService,
        private storage: StorageService, private router: Router, private platformLocation: PlatformLocation) {
        this.currentUserSubject = new BehaviorSubject<IUserDetails>(JSON.parse(this.storage.getLocalStorage('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // this API will be used to set global client parameters such as domain, IP, location
    public setClientGlobals() {
        this.clientGlobals = {
            domain: this.getCurrentDomain(),
        };
    }

    public getStaticWidget(name: string) {
        name = name.toLocaleUpperCase();
        if (!Validations.isNullOrUndefined(STATICWIDGETS[name])) {
            return STATICWIDGETS[name];
        } else {
            this.logger.logError("no static widget found for" + name);
        }
    }

    public getStaticWidgetAsObserver(name: string) {
        return new Observable((observer) => {
            const dataObject = this.getStaticWidget(name);
            observer.next(dataObject);
            observer.complete();
        });
    }

    public getWidgetList(page: string) {
        let widgets = null;
        switch (page) {
            case WebPagesNameConst.TEAM:
                widgets = TEAMPROFILEWIDGETS;
                break;
            case WebPagesNameConst.USER:
                widgets = USERPROFILEWIDGETS;
                break;
            case WebPagesNameConst.TOURNAMENT:
                widgets = TOURNAMENTPROFILEWIDGETS;
                break;
            default:
                break;
        }

        // return as observable so that in future we can load/get widget asynchronously i.e from http calls
        return new Observable((observer) => {
            observer.next(widgets);
            observer.complete();
        })
    }

    public subscribeActionResponse(action: IActionInfo, responseObservable: Observable<any>) {
        let isHandled = false;
        switch (action.id) {
            case "login":
                isHandled = true;
                this.handleLoginResponse(responseObservable);
                break;
        }
        return isHandled;
    }

    public isUserLoggedIn() {
        const userValue = this.currentUserValue;
        if (!Validations.isNullOrUndefined(userValue) && userValue.userId) {
            return true;
        }
    }

    public API_URLS = AppConstants.REST_API_URLS;

    public getAvailableFeatures(): string[] {
        let availableFeatures = [];
        if (this.currentUserValue && !Validations.isNullOrUndefined(this.currentUserValue.features)) {
            availableFeatures = this.currentUserValue.features;
        }
        return availableFeatures;
    }

    public get currentUserValue(): IUserDetails {
        return this.currentUserSubject.value;
    }

    public logout() {
        // remove user from local storage to log user out
        this.storage.removeLocalStorage('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(["/"]);
        location.reload();
    }

    public storeRouteParamValues(params: any, queryParams: any) {
        const menuTitle = params["title"];
        if (!Validations.isNullOrUndefined(menuTitle)) {
            this.storage.setRouteValue("menuTitle", menuTitle);
        }
        const tournamentId = params["tournamentId"];
        if (!Validations.isNullOrUndefined(tournamentId)) {
            this.storage.setRouteValue("tournamentId", tournamentId);
        }
        const bracketId = params["bracketId"];
        if (!Validations.isNullOrUndefined(bracketId)) {
            this.storage.setRouteValue("bracketId", bracketId);
        }
        const userId = params["userId"];
        if (!Validations.isNullOrUndefined(userId)) {
            this.storage.setRouteValue("userId", userId);
        }
        const teamId = params["teamId"];
        if (!Validations.isNullOrUndefined(teamId)) {
            this.storage.setRouteValue("teamId", teamId);
        }
        const returnUrl = queryParams['returnUrl'] || '/';
        if (!Validations.isNullOrUndefined(returnUrl)) {
            this.storage.setRouteValue("returnUrl", returnUrl);
        }
    }

    public getTeamBannerPath(teamId?: string) {
        if (Validations.isNullOrUndefined(teamId)) {
            teamId = this.storage.getRouteValue("teamId");
        }
        const imageRoutePath = this.getTeamImagesRootPath(teamId);
        return imageRoutePath + "/banner";
    }

    public getTeamRosterPath(teamId?: string) {
        if (Validations.isNullOrUndefined(teamId)) {
            teamId = this.storage.getRouteValue("teamId");
        }
        const imageRoutePath = this.getTeamImagesRootPath(teamId);
        return imageRoutePath + "/roster";
    }

    public getTeamGalleryPath(teamId?: string) {
        if (Validations.isNullOrUndefined(teamId)) {
            teamId = this.storage.getRouteValue("teamId");
        }
        const imageRoutePath = this.getTeamImagesRootPath(teamId);
        return imageRoutePath + "/gallery";
    }

    public getTeamthumbnailPath(teamId?: string) {
        if (Validations.isNullOrUndefined(teamId)) {
            teamId = this.storage.getRouteValue("teamId");
        }
        const imageRoutePath = this.getTeamImagesRootPath(teamId);
        return imageRoutePath + "/gallery/thumbnail";
    }

    public getUserProfilePath(teamId) {
        const imageRoutePath = this.getUserImagesRootPath(teamId);
        return imageRoutePath + "/profile";
    }

    public getDefaultUserProfileImage() {
        return this.getSiteImageRootPath() + "/default/user_image.png";
    }

    public getDefaultTeamBannerImage() {
        return this.getSiteImageRootPath() + "/default/team_banner.jpg";
    }

    public getDefaultTeamRosterImage() {
        return this.getSiteImageRootPath() + "/default/team_roster.jpg";
    }

    public hasGlobalSetting() {
        return this.siteGlobals ? true : false;
    }

    public setSiteGlobals(res) {
        this.siteGlobals = {
            domainId: res.domainId,
            siteHeading: res.siteHeading,
            siteNews: res.siteNews,
            sportValues: res.sportValues,
            stateValues: res.stateValues,
            imageUrls: res.images,
        }
    }

    public setDefaultGlobals() {
        this.siteGlobals = {
            domainId: 0,
            siteHeading: null,
            siteNews: null,
            sportValues: null,
            stateValues: null,
            imageUrls: null,
        }
    }

    public prepareActionLinks(page: string) {
        let links = [];
        switch (page) {
            case WebPagesNameConst.TEAM:
                links = this.prepareTeamActionLinks();
                break;
            case WebPagesNameConst.USER:
                links = this.prepareUserActionLinks();;
                break;
            // case WebPagesNameConst.TOURNAMENT:
            //     links = TOURNAMENTPROFILEWIDGETS;
            //     break;
            default:
                break;
        }
        return links;
    }

    private getActionLinkObj(text: string, actionInfo: IActionInfo, subType = "action") {
        const actionField: IFormPlainTextField = {
            text,
            actionInfo,
            subType,
        }
        return actionField;
    }

    private prepareTeamActionLinks() {
        const actionLinks: IFormPlainTextField[] = [];
        actionLinks.push(this.getActionLinkObj("Edit Team", TeamEditActions.Edit));
        actionLinks.push(this.getActionLinkObj("Add/Update Roster", TeamEditActions.ROSTER));
        actionLinks.push(this.getActionLinkObj("Add/Update Banner", TeamEditActions.Banner));
        actionLinks.push(this.getActionLinkObj("Add/Update Gallery", TeamEditActions.Gallery));
        return actionLinks;
    }

    private prepareUserActionLinks() {
        const actionLinks: IFormPlainTextField[] = [];
        actionLinks.push(this.getActionLinkObj("Approval Directors", UserEditActions.ApprovalDirector));
        actionLinks.push(this.getActionLinkObj("Add Team", UserEditActions.CreateTeam));
        actionLinks.push(this.getActionLinkObj("Edit Profile", UserEditActions.Edit));
        actionLinks.push(this.getActionLinkObj("Edit Profile Image", UserEditActions.ProfileImage));
        actionLinks.push(this.getActionLinkObj("Post A Tournament", UserEditActions.Tournament));
        actionLinks.push(this.getActionLinkObj("Change Password", UserEditActions.ChangePassword));
        return actionLinks;
    }

    private getCurrentDomain() {
        // console.error(this.platformLocation);
        return (this.platformLocation as any).location.hostname;
    }

    private getTeamImagesRootPath(teamId: string) {
        return this.getSiteImageRootPath() + "/teams/" + teamId;
    }

    private getUserImagesRootPath(userId: string) {
        return this.getSiteImageRootPath() + "/users/" + userId;
    }

    private getSiteImageRootPath() {
        return "assets/images";
    }

    private handleLoginResponse(responseObservable: Observable<IActionHanldeResponse>) {
        responseObservable.subscribe((resp: IActionHanldeResponse) => {
            // const res = resp.payload.data;
            if (resp.status === 1 && resp.payload.data.userId && resp.payload.data.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.storage.setLocalStorage('currentUser', JSON.stringify(resp.payload.data));
                this.currentUserSubject.next(resp.payload.data);
                const returnUrl = this.storage.getRouteValue("returnUrl");
                if (!Validations.isNullOrUndefined(returnUrl)) {
                    this.router.navigateByUrl(returnUrl);
                }
                location.reload();
            } else if (resp.errorCode === 403) {
                alert("Username or password is incorrect");
            }
        });
    }

}

export interface IWidgetItem {
    name: string;
    type: string;
}

export const WidgetTypes = {
    Form: "form",
    RichTable: "richTable",
    List: "list",
    Menu: "Menu",
    TextViewer: "textViewer",
    Tabs: "tabs",
    Ranking: "ranking",
    ExpansionPanel: "expansionPanel",
    ViewBrackets: "viewBrackets",
    ViewSingleBracket: "viewSingleBracket",
    ImageGallery: "imageGallery",
    TeamProfile: "teamProfile",
    UserProfile: "userProfile",
    KeyValue: "keyValue",
    TournamentProfile: "tournamentProfile",
    Tournamentlist: "TournamentList",
    Shortlist: "Shortlist",
    TeamRoster: "teamRoster",
}
