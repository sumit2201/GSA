import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

// text,email,tel,textarea,password, 
@Component({
  selector: "textbox",
  templateUrl: "./textbox-input.template.html",
})
export class TextBoxComponent {
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  get isValid() { return this.form.controls[this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.id].dirty; }

  constructor() {
    // TODO:
  }
}
