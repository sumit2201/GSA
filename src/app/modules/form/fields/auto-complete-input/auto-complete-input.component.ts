import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs/Rx";
import { IFormFieldOptions } from "../../../../common/interfaces";
import { Validations } from "../../../../common/utility";

@Component({
  selector: "auto-complete-input",
  templateUrl: "./auto-complete-input.component.html",
})
export class AutoCompleteInputComponent implements OnInit {
  @Input() public field: any = {};
  @Input() public form: FormGroup;
  filteredOptions: Observable<IFormFieldOptions[]>;
  constructor() {
    // TODO:
  }

  ngOnInit() {
      this.filteredOptions = this.form.get(this.field.id).valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
  }

  displayFn(option?: IFormFieldOptions) {
    return option  && option.title ? option.title : option;
  }

  private _filter(value: string): IFormFieldOptions[] {
    if (!Validations.isNullOrUndefined(value) && value.toLowerCase) {
      const filterValue = value.toLowerCase();
      if (!Validations.isNullOrUndefined(this.field.options)) {
        return this.field.options.filter(option => option.title.toLowerCase().includes(filterValue));
      } else {
        return [];
      }
    } else {
      return this.field.options;
    }
  }
}
