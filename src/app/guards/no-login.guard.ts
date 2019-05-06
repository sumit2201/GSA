import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Globals } from '../services/global';
import { AccessProviderService } from '../services/access-provider';



@Injectable({ providedIn: 'root' })
export class NoLoginGuard implements CanActivate {
    constructor(
        private router: Router,
        private accessProvider: AccessProviderService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(this.accessProvider.isLoggedIn()) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/']);
            return false;
        } 
        return true;
    }
}