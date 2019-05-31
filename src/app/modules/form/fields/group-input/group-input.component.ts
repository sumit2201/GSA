import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { LoggerService } from '../../../architecture-module/services/log-provider.service';
import { Validations } from '../../../../common/utility';
import { FormFieldManager } from '../../../../services/form-field-manager';
import { IFormField, IFormGroupField, IFormFieldOptions } from '../../../../common/interfaces';

@Component({
  selector: 'group-input',
  templateUrl: './group-input.component.html',
  styleUrls: ['./group-input.component.scss']
})
export class GroupInputComponent implements OnInit {
  @Input() public field: IFormGroupField
  @Input() public form: FormGroup;
  @Input() public formSubmittedByUser: boolean;
  public parentFormGroup: FormGroup;
  public allRemovable: boolean;
  public editable = true;
  get isValid() {
    return true;
    // return this.form.controls[this.field.id].valid;
  }
  get isDirty() {
    return false;
    // return this.form.controls[this.field.id].dirty;
  }
  constructor(private logger: LoggerService,
    private formFieldManager: FormFieldManager, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.setEditableState();
    this.setGroupFieldLoader();
    this.setGroupFieldOptionsCreator();
    this.setFieldOptionsProvider();
    this.handleGroupFieldLoadComplete();
  }

  public getFieldControls() {
    return (this.form.get(this.field.id) as FormArray).controls;
  }

  public addGroupRow(dataToSet?: any) {
    const newGroupRow = this.formFieldManager.prepareFieldArray(this.field, dataToSet);
    const controls = this.getFieldControls();
    controls.push(newGroupRow);
    this.form.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  public removeGroupRow(rowIndex: number) {
    const controls = this.getFieldControls();
    controls.splice(rowIndex, 1);
    this.form.updateValueAndValidity();
  }

  private setEditableState() {
    if (!Validations.isNullOrUndefined(this.field.editable) && !this.field.editable) {
      this.editable = false;
    }
    if (!Validations.isNullOrUndefined(this.field.allRemovable) && this.field.allRemovable) {
      this.allRemovable = true;
    } else {
      this.allRemovable = false;
    }
  }

  private setGroupFieldLoader() {
    this.field.groupFieldLoader = this.loadGroupFields.bind(this);
  }

  private setGroupFieldOptionsCreator() {
    this.field.groupFieldOptionsCreator = this.addOptionsInGroupFields.bind(this);
  }

  private setFieldOptionsProvider() {
    this.field.groupFieldOptionsProvider = this.prepareOptionValuesFromCurrentGroup.bind(this);
  }

  private emptyGroupFields() {
    const formArray = (this.form.get(this.field.id) as FormArray);
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  private handleGroupFieldLoadComplete() {
    if (!Validations.isNullOrUndefined(this.field.valueToSet)) {
      this.loadGroupFields(this.field.valueToSet);
    }
  }

  private loadGroupFields(data: any, noOfNewRows = 0, doRemoveBeforeAdd = true) {
    if (doRemoveBeforeAdd) {
      this.emptyGroupFields();
    }
    if (!Validations.isNullOrUndefined(data)) {
      for (const fieldObj of data) {
        this.addGroupRow(fieldObj);
      }
    } else if (noOfNewRows > 0) {
      for (let counter = 0; counter < noOfNewRows; counter++) {
        this.addGroupRow();
      }
    }
  }

  private prepareOptionValuesFromCurrentGroup(childFieldId: string) {
    const fieldOptionsToAdd = [];
    const formArray = (this.form.get(this.field.id) as FormArray);
    if (!Validations.isNullOrUndefined(formArray.controls) && formArray.controls.length) {
      for (const singleFormGroup of formArray.controls) {
        const fieldControl = singleFormGroup.get(childFieldId);
        const fieldDetails = this.formFieldManager.getFieldDetailsFromGroup(childFieldId, (singleFormGroup as any).fieldsArray);
        const optionVal = fieldControl.value;
        let optionTitle = "";
        if (!Validations.isNullOrUndefined(fieldDetails.options)) {
          for (const option of fieldDetails.options) {
            if (option.value === optionVal) {
              optionTitle = option.title;
              break;
            }
          }
          if (optionTitle !== "") {
            fieldOptionsToAdd.push({
              value: optionVal,
              title: optionTitle
            });
          }
        }
      }
    }
    return fieldOptionsToAdd;
  }

  private addOptionsInGroupFields(res: any) {
    const formArray = (this.form.get(this.field.id) as FormArray);
    if (!Validations.isNullOrUndefined(formArray.controls) && formArray.controls.length) {
      for (const singleFormGroup of formArray.controls) {
        for (const fieldId of res.fieldIds) {
          // const fieldControl = singleFormGroup.get(fieldId);
          const fieldDetails = this.formFieldManager.getFieldDetailsFromGroup(fieldId, (singleFormGroup as any).fieldsArray);
          if (Validations.isNullOrUndefined(fieldDetails.options)) {
            fieldDetails.options = [];
          }
          if (!this.formFieldManager.isFieldOptionExist(res["optionsToAdd"], fieldDetails.options)) {
            fieldDetails.options = fieldDetails.options.concat(res["optionsToAdd"]);
          }

          if (!Validations.isNullOrUndefined(res["valueMatcher"])) {
            if (!Validations.isNullOrUndefined(fieldDetails.options) && fieldDetails.options.length > 0) {
              for (const singleOption of fieldDetails.options) {
                if (singleOption.value === res["valueMatcher"]) {
                    const formField = singleFormGroup.get(fieldId);
                    // formField.setValue(res["valueMatcher"]);
                    formField.setValue(res["valueToSet"]);

                }
              }
            }
          }
        }
      }
    }
  }
}
