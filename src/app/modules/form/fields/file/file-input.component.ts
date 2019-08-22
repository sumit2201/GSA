import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

// text,email,tel,textarea,password, 
@Component({
  selector: "file-input",
  templateUrl: "./file-input.template.html",
  styleUrls: ["./file-input.style.scss"],
})
export class FileComponent {
  [x: string]: any;
  url: string;
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  public files: any[];
  get isValid() { return this.form.controls[this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.id].dirty; }

  constructor() {
    this.files = []; 
    // TODO:
  }

  onUpload() {
    const formData = new FormData();
    for (const file of this.files) {
        formData.append(name, file, file.name);
    }
   //  this.http.post('url', formData).subscribe(x => ....);
  }






  public ngOnChange() {
    console.log(this.field.value);
    // this.field.value.
  }
}
