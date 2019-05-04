import { IElementPosition } from "./interfaces";
import * as $ from "jquery";

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

(Element as any ).prototype.serializeWithStyles = (function () {  

    // Mapping between tag names and css default values lookup tables. This allows to exclude default values in the result.
    var defaultStylesByTagName = {};

    // Styles inherited from style sheets will not be rendered for elements with these tag names
    var noStyleTags = {"BASE":true,"HEAD":true,"HTML":true,"META":true,"NOFRAME":true,"NOSCRIPT":true,"PARAM":true,"SCRIPT":true,"STYLE":true,"TITLE":true};

    // This list determines which css default values lookup tables are precomputed at load time
    // Lookup tables for other tag names will be automatically built at runtime if needed
    var tagNames = ["A","ABBR","ADDRESS","AREA","ARTICLE","ASIDE","AUDIO","B","BASE","BDI","BDO","BLOCKQUOTE","BODY","BR","BUTTON","CANVAS","CAPTION","CENTER","CITE","CODE","COL","COLGROUP","COMMAND","DATALIST","DD","DEL","DETAILS","DFN","DIV","DL","DT","EM","EMBED","FIELDSET","FIGCAPTION","FIGURE","FONT","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEAD","HEADER","HGROUP","HR","HTML","I","IFRAME","IMG","INPUT","INS","KBD","KEYGEN","LABEL","LEGEND","LI","LINK","MAP","MARK","MATH","MENU","META","METER","NAV","NOBR","NOSCRIPT","OBJECT","OL","OPTION","OPTGROUP","OUTPUT","P","PARAM","PRE","PROGRESS","Q","RP","RT","RUBY","S","SAMP","SCRIPT","SECTION","SELECT","SMALL","SOURCE","SPAN","STRONG","STYLE","SUB","SUMMARY","SUP","SVG","TABLE","TBODY","TD","TEXTAREA","TFOOT","TH","THEAD","TIME","TITLE","TR","TRACK","U","UL","VAR","VIDEO","WBR"];

    // Precompute the lookup tables.
    for (var i = 0; i < tagNames.length; i++) {
        if(!noStyleTags[tagNames[i]]) {
            defaultStylesByTagName[tagNames[i]] = computeDefaultStyleByTagName(tagNames[i]);
        }
    }

    function computeDefaultStyleByTagName(tagName) {
        var defaultStyle = {};
        var element = document.body.appendChild(document.createElement(tagName));
        var computedStyle = getComputedStyle(element);
        for (var i = 0; i < computedStyle.length; i++) {
            defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
        }
        document.body.removeChild(element); 
        return defaultStyle;
    }

    function getDefaultStyleByTagName(tagName) {
        tagName = tagName.toUpperCase();
        if (!defaultStylesByTagName[tagName]) {
            defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
        }
        return defaultStylesByTagName[tagName];
    }

    return function serializeWithStyles() {
        if (this.nodeType !== Node.ELEMENT_NODE) { throw new TypeError(); }
        var cssTexts = [];
        var elements = this.querySelectorAll("*");
        for ( var i = 0; i < elements.length; i++ ) {
            var e = elements[i];
            if (!noStyleTags[e.tagName]) {
                var computedStyle = getComputedStyle(e);
                var defaultStyle = getDefaultStyleByTagName(e.tagName);
                cssTexts[i] = e.style.cssText;
                for (var ii = 0; ii < computedStyle.length; ii++) {
                    var cssPropName = computedStyle[ii];
                    if (computedStyle[cssPropName] !== defaultStyle[cssPropName]) {
                        e.style[cssPropName] = computedStyle[cssPropName];
                    }
                }
            }
        }
        var result = this.outerHTML;
        for ( var i = 0; i < elements.length; i++ ) {
            elements[i].style.cssText = cssTexts[i];
        }
        return result;
    }
})();

