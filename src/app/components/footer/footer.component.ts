import {
    Component,
    OnInit,AfterViewInit,
    Input
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.style.scss"],
})
export class FooterComponent implements OnInit , AfterViewInit{
    @Input() public heading: any;
    public localState: any;
    constructor(
        public route: ActivatedRoute
    ) {
        // this.heading = "test";
    }

    public ngOnInit() {
        this.route
            .data
            .subscribe((data: any) => {
                /**
                 * Your resolved data from route.
                 */
                this.localState = data.yourData;
            });
    }
    ngAfterViewInit() {
        if ($('#kode-topbtn').length) {
            $('#kode-topbtn').on("click", function() {
                jQuery('html, body').animate({ scrollTop: 0 }, 800);
                return false;
            });
        }
    }
}
