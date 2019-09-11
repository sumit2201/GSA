import { NgModule } from "@angular/core";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, PreloadAllModules, RouteReuseStrategy } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AngularEditorModule } from '@kolkov/angular-editor';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES, MyRouteReuseStrategy } from "./app.routes";
// App is our top level component
import { AppComponent } from "./app.component";
import { AboutComponent } from "./components/about/about.component";
import { SideBarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NoContentComponent } from "./components/no-content/no-content.component";
import { Globals } from "./services/global";
import { LoggerService } from "./modules/architecture-module/services/log-provider.service";
import { MetaProviderService } from "./services/meta-provider.service";
import { WidgetProviderService } from "./services/widget-provider.service";
import { ActionExecutorService } from "./services/data-provider.service";
import "./styles/styles.scss";
import "./styles/headings.css";
import { DynamicFormBuilderModule } from "./modules/form/dynamic-form-builder.module";
import { RichTableComponent } from "./components/richTable/rich-table.component";
import { FormLoaderComponent } from "./components/formLoader/form-loader.component";
import { TeamProfileComponent } from "./components/teamProfile/team-profile.component";
import { DataTransformationService } from "./services/data-transformation.service";

import { Ng2SmartTableModule } from "ng2-smart-table";
import { WidgetToggleComponent } from "./components/widgetToggle/widget-toggle.component";
import { ArchitectureModule } from "./modules/architecture-module/architecture-module.module";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { DynamicRouteComponent } from './dynamic-route/dynamic-route.component';
import { TextViewerComponent } from './components/text-viewer/text-viewer.component';
import { TeamListComponent } from './team-list/team-list.component';

import { AccessProviderService } from "./services/access-provider";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { AppMenuItemComponent } from './components/app-menu-item/app-menu-item.component';

import { TabViewerComponent } from './components/tab-viewer/tab-viewer.component';
import { UserProfileComponent } from './components/userProfile/user-profile.component';
import { TournamentProfileComponent } from './components/tournamentProfile/tournament-profile.component';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { AppGalleryComponent } from './components/app-gallery/app-gallery.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KeyValueComponent } from './components/key-value/key-value.component';
import { HomeComponent } from './components/home/home.component';
import { NoAccessComponent } from './components/no-access/no-access.component';
import { TournamentlistComponent } from './components/tournamentlist/tournamentlist.component';
import { ViewSingleBracketComponent } from "./components/view-single-bracket/view-single-bracket.component";
import { ViewBracketsComponent } from './components/view-brackets/view-brackets.component';
import { FormsModule } from "@angular/forms";
import { RosterComponent } from './components/roster/roster.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { DirectorProfileComponent } from './components/director-profile/director-profile.component';
import { CommonUserProfileComponent } from './components/common-user-profile/common-user-profile.component';
import { ShortlistComponent } from './components/shortlist/shortlist.component';
import { ModalComponent } from './components/modal/modal.component';
import { SliderComponent } from './components/slider/slider.component';
import { TopsliderComponent } from './components/topslider/topslider.component';
import { DropdownSearchComponent } from './components/dropdown-search/dropdown-search.component';
import { NewslatterComponent } from './components/newslatter/newslatter.component';
import { SponsorComponent } from './components/sponsor/sponsor.component';
import { CountComponent } from './components/count/count.component';
import { RecentMatchComponent } from './components/recent-match/recent-match.component';
import { TableComponent } from './components/table/table.component';
import { MiniWebComponent } from './components/mini-web/mini-web.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MiniWebHeaderComponent } from './components/mini-web-header/mini-web-header.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { ContactComponent } from './components/contact/contact.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashCardComponent } from './components/dash-card/dash-card.component';
import { DashTableComponent } from './components/dash-table/dash-table.component';
import { DashNavbarComponent } from './components/dash-navbar/dash-navbar.component';


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
*/

@NgModule({
  bootstrap: [AppComponent],
  entryComponents: [
    ExpansionPanelComponent, FormLoaderComponent,
    RichTableComponent, SideBarComponent, TextViewerComponent,
    TabViewerComponent, RankingComponent,
    AppGalleryComponent, TeamProfileComponent, UserProfileComponent, 
    TournamentProfileComponent, KeyValueComponent,ViewSingleBracketComponent,ViewBracketsComponent,TournamentlistComponent,RosterComponent, ShortlistComponent,
    HeaderComponent,RecentMatchComponent
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    NoContentComponent,
    FormLoaderComponent,
    RichTableComponent,
    WidgetToggleComponent,
    TeamProfileComponent,
    DynamicRouteComponent,
    TextViewerComponent,
    TeamListComponent,
    AppMenuItemComponent,
    TabViewerComponent,
    // UserProfileComponent,
    TournamentProfileComponent,
    ExpansionPanelComponent,
    RankingComponent,
    AppGalleryComponent,
    KeyValueComponent,
    UserProfileComponent,
    HomeComponent,
    NoAccessComponent,
    ViewSingleBracketComponent,
    TournamentlistComponent,
    ViewBracketsComponent,
    RosterComponent,
    AdminProfileComponent,
    DirectorProfileComponent,
    CommonUserProfileComponent,
    ShortlistComponent,
    ModalComponent,
    SliderComponent,
    TopsliderComponent,
    DropdownSearchComponent,
    NewslatterComponent,
    SponsorComponent,
    CountComponent,
    RecentMatchComponent,
    TableComponent,
    MiniWebComponent,
    TopbarComponent,
    MiniWebHeaderComponent,
    SubHeaderComponent,
    ContactComponent,
    FileUploadComponent,
    RegistrationComponent,
    DashboardComponent,
    DashCardComponent,
    DashTableComponent,
    DashNavbarComponent,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,    
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    DynamicFormBuilderModule,
    Ng2SmartTableModule,
    ArchitectureModule,
    NgxDatatableModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    AngularEditorModule,
    FlexLayoutModule,
    FormsModule,
   
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    Globals,
    LoggerService,
    WidgetProviderService,
    ActionExecutorService,
    DataTransformationService,
    MetaProviderService,
    AccessProviderService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: RouteReuseStrategy, useClass: MyRouteReuseStrategy }
  ]


})
export class AppModule { }
