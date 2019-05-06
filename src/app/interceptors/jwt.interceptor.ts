import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../services/global';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: Globals) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                headers: new HttpHeaders({
                    'Access-Control-Request-Headers': 'origin, x-requested -with',
                    'Origin': '*',
                    'Authorization': `Bearer ${currentUser.token}`
                })
            });
        }

        return next.handle(request);
    }
}