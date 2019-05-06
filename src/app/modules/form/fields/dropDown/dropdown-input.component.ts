import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IFormField } from "../../../../common/interfaces";

@Component({
  selector: "dropdown",
  templateUrl: "./dropdown-input.template.html",
})
export class DropDownComponent implements OnInit {
  @Input() public field: IFormField;
  @Input() public form: FormGroup;

  constructor() {
    // TODO:
  }

  public ngOnInit() {
    // console.error("drop-down field details of ", this.field);

  }
}
