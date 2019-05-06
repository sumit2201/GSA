import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

// text,email,tel,textarea,password, 
@Component({
  selector: "file-input",
  templateUrl: "./file-input.template.html",
  styleUrls: ["./file-input.style.scss"],
})
export class FileComponent {
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  get isValid() { return this.form.controls[this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.id].dirty; }

  constructor() {
    // TODO:
  }

  public ngOnChange() {
    console.log(this.field.value);
    // this.field.value.
  }
}
