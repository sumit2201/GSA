import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
@Component({
  selector: 'rich-text-input',
  templateUrl: './rich-text-input.component.html',
  styleUrls: ['./rich-text-input.component.scss']
})
export class RichTextInputComponent {
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  get isValid() { return true }
  get isDirty() { return this.form.controls[this.field.id].dirty; }
  constructor() {
    (window as any).tinyMCE.overrideDefaults({
      base_url: '/tinymce/',  // Base for assets such as skins, themes and plugins
      suffix: '.min'          // This will make Tiny load minified versions of all its assets
    });
  }

}
