import { Routes, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { AboutComponent } from "./components/about/about.component";
import { NoContentComponent } from "./components/no-content";
import { AuthGuardDirectors } from "./guards/director.guard";
import { DynamicRouteComponent } from "./dynamic-route/dynamic-route.component";
import { Globals } from "./services/global";
import { HomeComponent } from "./components/home/home.component";
import { NoAccessComponent } from "./components/no-access/no-access.component";
import { NoLoginGuard } from "./guards/no-login.guard";
import { LoginGuard } from "./guards/login.guard";


export const ROUTES: Routes = [
    { path: "", component: HomeComponent },
    { path: "about-us", component: AboutComponent },
    {
        path: "team-profile/:teamId", component: DynamicRouteComponent, data: {
            type: "teamProfile",
        }
    },
    {
        path: "user-profile/:userId", component: DynamicRouteComponent, data: {
            type: "userProfile",
        }
    },
    {
        path: "tournament-profile/:tournamentId", component: DynamicRouteComponent, data: {
            type: "tournamentProfile",
        }
    },
    {
        path: "login", component: DynamicRouteComponent, canActivate:[NoLoginGuard], data: {
            type: "login"
        }
    },
    {
        path: "register", component: DynamicRouteComponent, canActivate:[NoLoginGuard], data: {
            type: "register"
        }
    },
    {
        path: "user-verification/:userId", component: DynamicRouteComponent, data: {
            type: "userVerification"
        }
    },
    {
        path: "add-menu-item", component: DynamicRouteComponent, data: {
            type: "addMenu"
        }
    },
    {
        path: "add-tournament", component: DynamicRouteComponent, canActivate: [AuthGuardDirectors], data: {
            type: "addTournament"
        }
    },
    {
        path: "add-bracket/:tournamentId", canActivate: [AuthGuardDirectors], component: DynamicRouteComponent, data: {
            type: "addBracket"
        }
    },
    {
        path: "edit-bracket/:tournamentId/:bracketId", canActivate: [AuthGuardDirectors], component: DynamicRouteComponent, data: {
            type: "editBracket"
        }
    },
    {
        path: "add-team", component: DynamicRouteComponent, data: {
            type: "addTeam"
        }
    },
    {
        path: "add-team-banner/:teamId", component: DynamicRouteComponent, canActivate: [LoginGuard],  data: {
            type: "addTeamBanner"
        }
    },
    {
        path: "add-roster/:teamId", component: DynamicRouteComponent, canActivate: [LoginGuard], data: {
            type: "addRoster"
        }
    },
    {
        path: "add-team-gallery/:teamId", component: DynamicRouteComponent, canActivate: [LoginGuard], data: {
            type: "ADDTEAMGALLERY"
        }
    },
    {
        path: "update-team-gallery/:teamId", canActivate: [LoginGuard],component: DynamicRouteComponent, data: {
            type: "updateTeamGallery"
        }
    },
    {
        path: "edit-menu-item/:menuId", canActivate: [AuthGuardDirectors], component: DynamicRouteComponent, data: {
            type: "editMenu"
        }
    },
    {
        path: "who-is-playing/:tournamentId", component: DynamicRouteComponent, data: {
            type: "whoIsPlaying"
        }
    },
    {
        path: "teams", component: DynamicRouteComponent, data: {
            type: "teamListFilter"
        }
    },
    {
        path: "tournaments", component: DynamicRouteComponent, data: {
            type: "tournamentListFilter"
        }
    },
    {
        path: "rankings", component: DynamicRouteComponent, data: {
            type: "rankingFilter"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId", canActivate: [NoLoginGuard], component: DynamicRouteComponent, data: {
            type: "registerTournamentUnknown"
        },
    },
    {
        path: "register-tournament/:tournamentId", canActivate: [LoginGuard], component: DynamicRouteComponent, data: {
            type: "TOURNAMENTREGISTRATION"
        },
    },
    {
        path: "register-tournament/:tournamentId/tournament-register-confirm/:teamId", canActivate: [LoginGuard], component: DynamicRouteComponent, data: {
            type: "tournamentRegisterConfirm"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/register-by-email", canActivate: [NoLoginGuard],component: DynamicRouteComponent, data: {
            type: "RegisterByEmail"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/add-team", canActivate: [NoLoginGuard], component: DynamicRouteComponent, data: {
            type: "addTeam"
        }
    },
    {
        path: "register-tournament/:tournamentId", canActivate: [LoginGuard], component: DynamicRouteComponent, data: {
            type: "registerTournament"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/tournament-register-confirm/:teamId", canActivate: [NoLoginGuard],component: DynamicRouteComponent, data: {
            type: "tournamentRegisterConfirm"
        }
    },
    {
        path: "users", component: DynamicRouteComponent, data: {
            type: "userList"
        }
    },
    {
        path: "content/:title", component: DynamicRouteComponent, data: {
            type: "showMenuItem"
        }
    },
    {
        path: "update-site-details", canActivate: [AuthGuardDirectors], component: DynamicRouteComponent, data: {
            type: "updateSiteDetails"
        }
    },
    { path: "no-access", component: NoAccessComponent },
    { path: "**", component: NoContentComponent }];

export class MyRouteReuseStrategy implements RouteReuseStrategy {

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): boolean {
        return false;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return false;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return false;
    }
}