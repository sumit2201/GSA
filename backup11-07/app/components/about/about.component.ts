import {
  Component,
  OnInit,
  Input
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../services/global";

@Component({
  templateUrl: "./about.component.html",
})
export class AboutComponent implements OnInit {
  @Input() public heading: any;
  public localState: any;
  public schema: any;
  public formData: any;
  constructor(
    public route: ActivatedRoute, private http: HttpClient, private global: Globals
  ) {
    // this.heading = "test";
  }

  public ngOnInit() {
    // TODO:
  }
}
