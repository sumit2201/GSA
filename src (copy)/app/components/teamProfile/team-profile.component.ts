import {
    Component,
    OnInit,
    Input
} from "@angular/core";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../services/global";
import { Validations } from "../../common/utility";
import { switchMap } from "rxjs/operators";
import { WidgetProviderService } from "../../services/widget-provider.service";
import { Observable } from "rxjs/Rx";
import { IWidgetInfo, IFormPlainTextField } from "../../common/interfaces";
import { StorageService } from "../../services/storage";
import { ActionExecutorService } from "../../services/data-provider.service";
import { LoggerService } from "../../modules/architecture-module/services/log-provider.service";
import { AppDataParent } from "../../common/app-data-format";
import { MatTabChangeEvent } from "@angular/material";
import { AccessProviderService } from "../../services/access-provider";

@Component({
    templateUrl: "./team-profile.template.html",
    styleUrls: ['./team-profile.component.scss']
})
export class TeamProfileComponent implements OnInit {
    @Input() public widgetData: AppDataParent;
    public widgets: { [key: string]: IWidgetInfo };
    public parameters: { [key: string]: string };
    public teamData: any;
    public adminLinks: IFormPlainTextField[];
    constructor(
        private logger: LoggerService,
        public route: ActivatedRoute, private dataProvider: ActionExecutorService,
        private globals: Globals,
        private storage: StorageService,private accessProvider: AccessProviderService
    ) {
    }

    public ngOnInit() {
        this.prepareTeamData();
        const widgetObserver = this.globals.getWidgetList("team");
        // forkJoin is not neccesary
        Observable.forkJoin(widgetObserver).subscribe((data: any) => {
            this.widgets = data[0];
        }, (err) => {
            console.error("error occured");
        });
    }


    public canUpdateTeam(){
        return this.accessProvider.canUpdateTeam(this.teamData);
    }

    public prepareTeamData() {
        this.teamData = {};
        if (!Validations.isNullOrUndefined(this.widgetData) && !Validations.isNullOrUndefined(this.widgetData.getRawData())) {
            const rawData = this.widgetData.getRawData();
            if (!Validations.isNullOrUndefined(rawData.data) && rawData.data.length) {
                this.teamData = rawData.data[0];
                this.prepareAdminLinks();
            } else {
                this.logger.logDebug("widget raw data is not valid in team profile");
                this.logger.logDebug(this.widgetData);
            }
        } else {
            this.logger.logDebug("widget data is not valid in team profile");
            this.logger.logDebug(this.widgetData);
        }
    }

    public prepareAdminLinks() {
        const adminLinks = this.globals.prepareActionLinks("team");
        if (adminLinks.length) {
            this.adminLinks = adminLinks;
        }
    }


    public getBannerImage() {
        if (!Validations.isNullOrUndefined(this.teamData.group_banner) && this.teamData.group_banner) {
            const imageDirectory = this.globals.getTeamBannerPath(this.teamData.teamId);
            return imageDirectory + "/" + this.teamData.group_banner;
        } else {
            return this.globals.getDefaultTeamBannerImage();
        }
    }

    public getTeamRelatedParameters() {
        const values = {
            teamId: this.teamData.teamId,
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
}
