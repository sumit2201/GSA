import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Globals } from '../services/global';
import { AccessProviderService } from '../services/access-provider';



@Injectable({ providedIn: 'root' })
export class AuthGuardDirectors implements CanActivate {
    constructor(
        private router: Router,
        private accessProvider: AccessProviderService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.accessProvider.isSuperAdmin() || this.accessProvider.isDirector()) {
            return true;
        } else if (this.accessProvider.isLoggedIn()) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/no-access']);
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url, showAccessMsg: true } });
        }

        return false;
    }
}