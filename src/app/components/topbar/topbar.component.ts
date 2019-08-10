import {
  Component,
  OnInit, AfterViewInit,
  Input
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IWidgetInfo, IWidgetToggleSettings, IUserDetails, IGlobalSettings } from "../../common/interfaces";
import { Globals } from '../../services/global';
import { AccessProviderService } from "src/app/services/access-provider";


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})


export class TopbarComponent implements OnInit {
  @Input() public heading: any;
  [x: string]: any;
  public localState: any;
  public currentUserValue: IUserDetails;
  public siteGlobals: IGlobalSettings;
  public multisiteSelect: IWidgetInfo;
  public loginWidget: IWidgetInfo;
    public registerWidget: IWidgetInfo;
  constructor(
    public route: ActivatedRoute,
    private accessProvider: AccessProviderService, private router: Router, private globals: Globals
  ) {
  }

  public ngOnInit() {
    this.currentUserValue = this.globals.currentUserValue;
    this.siteGlobals = this.globals.siteGlobals;
    this.prepareStaticWidgets();
  }
 
  private prepareStaticWidgets() {
   
    this.multisiteSelect = this.globals.getStaticWidget("MULTISITESELECT");
  }


  public navigateTest() {
    this.router.navigate(['/team-profile', 2766]);
  }


  public hasAccess(feature: string) {
    return this.accessProvider.hasAccess(feature);
  }

  public logout() {
    this.globals.logout();
  }

}

