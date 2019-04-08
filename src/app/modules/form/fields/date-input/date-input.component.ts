import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit {
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  get isValid() { return this.form.controls[this.field.id].valid; }
  get isDirty() { return this.form.controls[this.field.id].dirty; }
  constructor() { }

  ngOnInit() {
  }

}
