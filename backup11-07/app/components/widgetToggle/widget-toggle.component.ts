import { OnInit, Input, Component, ElementRef } from "@angular/core";
import { IWidgetToggleSettings } from "../../common/interfaces";
import { UIHelper } from "../../common/utility";
import * as $ from "jquery";

@Component({
    selector: "app-widget-toggle",
    templateUrl: "./widget-toggle.template.html",
    styleUrls: ["./widget-toggle.style.scss"],
})

export class WidgetToggleComponent implements OnInit {
    @Input() public settings: IWidgetToggleSettings;
    public isElementVisile: boolean = false;
    public isActive: boolean;

    constructor(private elementRef: ElementRef) {
        this.isActive = false;
    }
    public ngOnInit() {
        // TODO:
        console.error(this.settings);
    }

    public handleEventForToggle($event: MouseEvent, settings: IWidgetToggleSettings) {
        if (!this.isActive) {
            this.isActive = true;
            setTimeout(() => {
                const targetElement = this.getTargetElementForToggle($event);
                const elementPosToOpen = UIHelper.getAbsoluteCoordsForElement(targetElement);
                const elementToOpen = $(this.elementRef.nativeElement).find(".app-toggle-place") as any;
                const positionToOpen = UIHelper.adjustPositionAsPerWindow(elementPosToOpen, elementToOpen);
                UIHelper.setPosition(positionToOpen, elementToOpen);
            },100);
        } else {
            this.isActive = false
        }
    }

    private getTargetElementForToggle($event: MouseEvent) {
        return $($event.target) as JQuery;
    }
}
