import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "list-input",
  templateUrl: "./list-input.template.html",
})
export class ListInputComponent {
  @Input() public field: any = {};
  @Input() public form: FormGroup;

  constructor() {
    // TODO:
  }
}
