import { Routes, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { AboutComponent } from "./components/about/about.component";
import { ContactComponent } from "./components/contact/contact.component";
import { NoContentComponent } from "./components/no-content";
import { AuthGuardDirectors } from "./guards/director.guard";
import { DynamicRouteComponent } from "./dynamic-route/dynamic-route.component";
import { Globals } from "./services/global";
import { HomeComponent } from "./components/home/home.component";
import { NoAccessComponent } from "./components/no-access/no-access.component";
import { NoLoginGuard } from "./guards/no-login.guard";
import { LoginGuard } from "./guards/login.guard";
import { AuthGuardSuperAdmin } from "./guards/superAdmin.guard";
import { RegistrationComponent } from "./components/registration/registration.component";

export const ROUTES: Routes = [
    { path: "", component: HomeComponent },
    { path: "about-us", component: AboutComponent },
    { path: "contact-us", component: ContactComponent },
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
        path: "edit-user/:userId", component: DynamicRouteComponent, data: {
            type: "editUserProfile",
        }
    },
    {
        path: "tournament-profile/:tournamentId", component: DynamicRouteComponent, data: {
            type: "tournamentProfile",
        }
    },
    {
        path: "forget-password", component: DynamicRouteComponent, data: {
            type: "forgetpassword",
        }
    },
    {
        path: "login", component: DynamicRouteComponent, canActivate: [NoLoginGuard], data: {
            type: "login"
        }
    },
    {
        path: "register", component: DynamicRouteComponent, canActivate: [NoLoginGuard], data: {
            type: "USERREGISTER"
        }
    },
    {
        path: "user-verification/:userId", component: DynamicRouteComponent, data: {
            type: "USEREMAILVERIFICATION"
        }
    },
    {
        path: "mobile-verification/:userId", component: DynamicRouteComponent, data: {
            type: "USERMOBILEVERIFICATION"
        }
    },
    {
        path: "pending-profile-approval", component: DynamicRouteComponent, data: {
            type: "PENDINGDIRECTORAPPROVAL"
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
        path: "edit-tournament/:tournamentId", component: DynamicRouteComponent, canActivate: [LoginGuard], data: {
            type: "EDITTOURNAMENT"
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
        path: "approval-director", component: DynamicRouteComponent, canActivate: [AuthGuardSuperAdmin], data: {
            type: "directorListFilter"
        }
    },
    {
        path: "change-password", component: DynamicRouteComponent, canActivate: [LoginGuard], data: {
            type: "changePassword"
        }
    },
    {
        path: "reset-password/:userId", component: DynamicRouteComponent, data: {
            type: "resetPassword"
        }
    },
    {
        path: "add-team", component: DynamicRouteComponent, data: {
            type: "addTeam"
        }
    },
    {
        path: "add-team-login", component: DynamicRouteComponent, data: {
            type: "addTeamLogin"
        }
    },
    {
        path: "add-team-banner/:teamId", component: DynamicRouteComponent, canActivate: [LoginGuard], data: {
            type: "addTeamBanner"
        }
    },
    {
        path: "edit-team/:teamId", component: DynamicRouteComponent, canActivate: [LoginGuard], data: {
            type: "editTeam"
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
        path: "update-team-gallery/:teamId", canActivate: [LoginGuard], component: DynamicRouteComponent, data: {
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
        path: "register-tournament/:tournamentId", component: DynamicRouteComponent, data: {
            type: "TOURNAMENTREGISTRATION",
            subType: "tournamentRegistrationHeading",
        },
    },
    {
        path: "register-tournament/:tournamentId/tournament-register-confirm/:teamId", component: DynamicRouteComponent, data: {
            type: "tournamentRegisterConfirm",
            subType: "tournamentRegistrationHeading",
        }
    },
    {
        path: "register-tournament/:tournamentId/tournament-register-success/:teamId", component: DynamicRouteComponent, data: {
            type: "TOURNAMENTREGISTERSUCCESS"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/register-by-email", component: DynamicRouteComponent, data: {
            type: "RegisterByEmail"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/add-team", component: DynamicRouteComponent, data: {
            type: "addTeam"
        }
    },
    {
        path: "register-tournament/:tournamentId", canActivate: [LoginGuard], component: DynamicRouteComponent, data: {
            type: "registerTournament"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/tournament-register-confirm/:teamId", component: DynamicRouteComponent, data: {
            type: "tournamentRegisterConfirm"
        }
    },
    {
        path: "register-tournament-no-login/:tournamentId/tournament-register-success/:teamId", component: DynamicRouteComponent, data: {
            type: "TOURNAMENTREGISTERSUCCESS"
        }
    },
    {
        path: "users", component: DynamicRouteComponent, data: {
            type: "userListFilter"
        }
    },
    {
        path: "registration", component: RegistrationComponent, data: {
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
    {
        path: "view-brackets/:tournamentId", component: DynamicRouteComponent, data: {
            type: "viewBrackets"
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