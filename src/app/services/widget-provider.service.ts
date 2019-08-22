import { HttpClient } from "@angular/common/http";
import { Injectable, ComponentFactoryResolver } from "@angular/core";
import { Globals, WidgetTypes } from "./global";
import { RichTableComponent } from "../components/richTable/rich-table.component";
import { FormLoaderComponent } from "../components/formLoader/form-loader.component";
import { TextViewerComponent } from "../components/text-viewer/text-viewer.component";
import { TabViewerComponent } from "../components/tab-viewer/tab-viewer.component";
import { ExpansionPanelComponent } from "../components/expansion-panel/expansion-panel.component";
import { RankingComponent } from "../components/ranking/ranking.component";
import { AppGalleryComponent } from "../components/app-gallery/app-gallery.component";
import { TeamProfileComponent } from "../components/teamProfile/team-profile.component";
import { TournamentProfileComponent } from "../components/tournamentProfile/tournament-profile.component";
import { KeyValueComponent } from "../components/key-value/key-value.component";
import { UserProfileComponent } from "../components/userProfile/user-profile.component";
import { TournamentlistComponent } from "../components/tournamentlist/tournamentlist.component";
import { ViewSingleBracketComponent } from "../components/view-single-bracket/view-single-bracket.component";
import { ViewBracketsComponent } from "../components/view-brackets/view-brackets.component";
import { RosterComponent } from "../components/roster/roster.component";
import { ShortlistComponent } from "../components/shortlist/shortlist.component";
import { HeaderComponent } from "../components/header/header.component";
import { RecentMatchComponent } from "../components/recent-match/recent-match.component";



@Injectable()
export class WidgetProviderService {
  public widgetList: any[];
  constructor(private http: HttpClient, private global: Globals, private componentFactoryResolver:
    ComponentFactoryResolver) {

  }


  public mapWidgetWithComponent(widgetDataObj) {
    let componentFactory;
    switch (widgetDataObj.name) {
      case WidgetTypes.ExpansionPanel:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(ExpansionPanelComponent);
        break;
      case WidgetTypes.Form:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(FormLoaderComponent);
        break;
      case WidgetTypes.RichTable:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RichTableComponent);
        break;
      case WidgetTypes.Menu:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(HeaderComponent);
        break;
      case WidgetTypes.TextViewer:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(TextViewerComponent);
        break;
      case WidgetTypes.Tabs:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabViewerComponent);
        break;
      case WidgetTypes.Ranking:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RankingComponent);
        break;
      case WidgetTypes.ImageGallery:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppGalleryComponent);
        break;
      case WidgetTypes.TeamProfile:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(TeamProfileComponent);
        break;
      case WidgetTypes.TeamRoster:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RosterComponent);
        break;
      case WidgetTypes.UserProfile:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
        break;
      case WidgetTypes.TournamentProfile:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(TournamentProfileComponent);
        break;
      case WidgetTypes.KeyValue:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(KeyValueComponent);
        break;
      case WidgetTypes.ViewBrackets:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(ViewBracketsComponent);
        break;
      case WidgetTypes.ViewSingleBracket:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(ViewSingleBracketComponent);
        break;
      case WidgetTypes.Tournamentlist:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(TournamentlistComponent);
        break;
      case WidgetTypes.Shortlist:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(ShortlistComponent);
        break;
      case WidgetTypes.UpcommingTournament:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RecentMatchComponent);
        break;
      default:
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RichTableComponent);
        break;
    }
    return componentFactory;
  }
}
