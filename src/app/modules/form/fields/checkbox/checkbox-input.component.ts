import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "checkbox-input",
  templateUrl: "./checkbox-input.template.html",
})
export class CheckBoxComponent {
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  get isValid() { return this.form.controls[this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.id].dirty; }
}