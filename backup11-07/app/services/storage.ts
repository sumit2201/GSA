// globals.tse
import { Injectable } from "@angular/core";
import { AppConstants } from "../common/api-urls";
import { Validations } from "../common/utility";
import { LoggerService } from "../modules/architecture-module/services/log-provider.service";
@Injectable()
export class StorageService {

    constructor(private logger: LoggerService) {
        // TODO;
    }

    public setLocalStorage(name: string, value: any) {
        localStorage.setItem(name, value);
    }

    public getLocalStorage(name: string) {
        return localStorage.getItem(name);
    }

    public removeLocalStorage(name: string) {
        localStorage.setItem(name, null);
    }

    public setSessionStorage(name: string, value: any) {
        sessionStorage.setItem(name, value);
    }

    public getSessionStorage(name: string) {
        return sessionStorage.getItem(name);
    }

    public removeSessionStorage(name: string) {
        sessionStorage.setItem(name, null);
    }

    public setRouteValue(name: string, value: any) {
        this.setSessionStorage(this.prepareRouteParamName(name), value);
    }

    public getRouteValue(name: string) {
        return this.getSessionStorage(this.prepareRouteParamName(name));
    }

    public removeRouteValue(name: string) {
        this.removeSessionStorage(this.prepareRouteParamName(name));
    }

    private prepareRouteParamName(name: string) {
        return "ROUTE_" + name;
    }


} 