import { IElementPosition } from "./interfaces";
import * as $ from "jquery";
import { Observable } from "rxjs";

export class Validations {
    public static isNullOrUndefined(value: any) {
        if (value === null || value === undefined) {
            return true;
        }
        return false;
    }

    public static isObjectEmpty(obj: any): boolean {
        let isEmpty = true;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                isEmpty = false;
                break;
            }
        }
        return isEmpty;
    }

    public static isArray(val: any){
        return val instanceof Array;
    }
}

export class CommonUtils{
    public static copyObject(obj: any){
        return Object.assign({}, obj);
    }

    public static toNumber(val){
        return parseInt(val);
    }

    public static isValidResponse(response){
        if(response.status === 1 ){
            return true;
        }
        return false;
    }

    public static prepareResponse(isSuccess: number, response: any, errorCode?: number, errorMessage?: string){
        return {
            status: isSuccess,
            response,
            errorCode,
            errorMessage
        }
    }

    public static getResponseAsObservable(response: any){
        return new Observable((observer) => {
            observer.next(response);
            observer.complete();
          });
    }
}

export class TimeUtils {
    public static getCurrentTime(){
        return new Date().getTime();
    }
}


export class UIHelper {
    public static getAbsoluteCoordsForElement($elem: JQuery) {
        const offsetElement = $elem.offset();
        return {
            left: offsetElement.left,
            top: offsetElement.top,
            height: $elem.outerHeight(),
            width:  $elem.outerWidth()
        };
    }

    public static adjustPositionAsPerWindow(currentPosition: IElementPosition, $elem: JQuery) {
        const offsetElement = $elem.offset();
        const totalWidth = UIHelper.getAvailableWidth();
        const totalHeight = UIHelper.getAvailableHeight();
        const elementWidth = $elem.outerWidth();
        const elementHeight = $elem.outerHeight();
        let newX = currentPosition.left;
        if (currentPosition.left + elementWidth > totalWidth) {
            newX = totalWidth - elementWidth;
        }
        let newY = currentPosition.top + currentPosition.height;
        if (newY + elementHeight > totalHeight) {
            newY = currentPosition.top - elementHeight;
        }
        return {
            left: newX,
            top: newY,
        };
    }

    public static setPosition(currentPosition: IElementPosition, $elem: JQuery) {
        $elem.css({
            top: currentPosition.top,
            left: currentPosition.left,
        });
    }

    public static getAvailableWidth() {
        return $("body").width();
    }

    public static getAvailableHeight() {
        return $("body").height();
    }
}

export class StaticDataUtils {
    public static getNumberOfTeamsForDropDown(){
        const allGames = [];
        for(let gameCounter=1; gameCounter <= 40; gameCounter++){
            const fieldObj = {
                id: gameCounter,
                title: gameCounter,
            }
            allGames.push(fieldObj);
        }
        return allGames;
    }

    public static getNumberOfGamesForDropDown(){
        const allGames = [];
        for(let gameCounter=1; gameCounter <= 100; gameCounter++){
            const fieldObj = {
                id: gameCounter,
                title: gameCounter,
            }
            allGames.push(fieldObj);
        }
        return allGames;
    }
}

