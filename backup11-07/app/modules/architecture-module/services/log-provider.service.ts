// globals.ts
import { Injectable } from "@angular/core";
const LogTypes = {
    Error: "ERROR",
    Info: "INFO",
    Warn: "WARN",
    Debug: "DEBUG",
};
@Injectable()
export class LoggerService {

    public logInfo(msg: any) {
        // TODO: change to info
        this.logMessage(msg, LogTypes.Error);
    }

    public logWarn(msg: any) {
        // TODO: change to info
        this.logMessage(msg, LogTypes.Warn);
    }

    public logError(msg: any) {
        // TODO: change to info
        this.logMessage(msg, LogTypes.Error);
    }

    public logDebug(msg: any) {
        // TODO: change to info
        this.logMessage(msg, LogTypes.Debug);
    }

    public logMessage(msg: any, type: string) {
        switch (type) {
            case LogTypes.Error:
                console.error(msg);
                break;
            case LogTypes.Info:
                console.info(msg);
                break;
            case LogTypes.Warn:
                console.warn(msg);
                break;
            case LogTypes.Debug:
                console.debug(msg);
                break;
            default:
                console.error(msg);
                break;
        }
    }
}
