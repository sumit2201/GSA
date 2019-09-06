import { Component, Input } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";

// text,email,tel,textarea,password, 
@Component({
  selector: "file-input",
  templateUrl: "./file-input.template.html",
  styleUrls: ["./file-input.style.scss"],
})
export class FileComponent {
  public imagePath;
  imgURL: any;
  public message: string;
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  public files: any[];
  get isValid() { return this.form.controls[this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.id].dirty; }

  constructor() {
    this.files = [];
    // TODO:
  }

  uploadFile(event) {
    const file = event.target.files[0];
    if (event.target.files.length === 0) {
      return;
    }
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      console.log(reader.result);
      this.imgURL = reader.result;
    };

    const formField = this.form.get(this.field.id);
    // formField.setValue(res["valueMatcher"]);
    formField.setValue(event.target.files);
  }

}
