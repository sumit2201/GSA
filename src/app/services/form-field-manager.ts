import { Injectable } from "@angular/core";

import { LoggerService } from "../modules/architecture-module/services/log-provider.service";

import { Validations, CommonUtils, TimeUtils } from "../common/utility";

import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { IFormField, IAppFormFieldDetail, IFormFieldOptions } from "../common/interfaces";

@Injectable()
export class FormFieldManager {
    private nameWiseFields: { [key: string]: IFormField } = {};
    private formValueProvider: any;
    constructor(private logger: LoggerService, private formBuilder: FormBuilder) {

    }

    public createFormControl(field: IFormField) {
        const fieldControl = new FormControl(field.value || "");
        this.setFieldValidators(fieldControl, field);
        return fieldControl;
    }

    public setFieldValidators(fieldControl: FormControl, field: IFormField) {
        fieldControl.clearValidators();
        const fieldValidators = [];
        if (this.isFieldApplicableToValidate(field)) {
            if (!Validations.isNullOrUndefined(field.required) && field.required) {
                fieldValidators.push(Validators.required);
                // change field display value add * prefix on required fields
                if (Validations.isNullOrUndefined(field.name)) {
                    field.name = field.title;
                }
                if (Validations.isNullOrUndefined(field.originalTitle)) {
                    field.originalTitle = field.title;
                }
                field.title = field.originalTitle + " * ";
            }
            if (field.type === "email") {
                fieldValidators.push(Validators.email);
            }
            if (fieldValidators.length > 0) {
                fieldControl.setValidators(fieldValidators);
            }
        }
        fieldControl.updateValueAndValidity();
    }

    public resetFieldValidators(field: IFormField, formGroup: FormGroup) {
        const fieldControl = formGroup.get(field.id) as FormControl;
        this.setFieldValidators(fieldControl, field);
    }

    public createFormArrayControl(form_field) {
        const fieldArray = this.prepareFieldArray(form_field);
        return new FormArray([fieldArray]);
    }

    public prepareFieldArray(form_field: any, dataToSet = {}) {
        if (!Validations.isNullOrUndefined(form_field.fields) && form_field.fields.length > 0) {
            const fieldsCtrls = {};
            const newFieldArReference = [];
            // field index will be used 
            let fieldIndex = -1;
            for (let field of form_field.fields) {
                fieldIndex++;
                const newFieldReference = CommonUtils.copyObject(field);
                newFieldArReference.push(newFieldReference);
                newFieldReference.indexInGroup = fieldIndex;
                if (newFieldReference.type !== 'group') {
                    if (!Validations.isNullOrUndefined(dataToSet[newFieldReference.id])) {
                        newFieldReference.valueToSet = this.getValueToSetAccordingToFieldType(newFieldReference, dataToSet[newFieldReference.id]);
                        if(newFieldReference.type === 'dropdown'){
                            if(Validations.isNullOrUndefined(newFieldReference.options) || !Validations.isArray(newFieldReference.options)){
                                newFieldReference.options = [];
                            }
                            const newOption = {
                                title: newFieldReference.valueToSet,
                                value: newFieldReference.valueToSet,
                            }
                            newFieldReference.options.push(newOption);
                        }
                    } 
                    // const valueOfField = this.getValueOfFieldToSet(newFieldReference, dataToSet);
                    fieldsCtrls[field.id] = new FormControl("", newFieldReference.required ? Validators.required : null);
                }
            }
            const fieldGroupAr = new FormGroup(fieldsCtrls);
            (fieldGroupAr as any).fieldsArray = newFieldArReference;
            return fieldGroupAr;
        } else {
            this.logger.logError("Invalid group type field provided");
            this.logger.logError(form_field);
        }
    }

    public getFieldDetailsFromGroup(fieldId: string, groupFieldAr: IFormField[]) {
        for (const fieldInfo of groupFieldAr) {
            if (fieldInfo.id === fieldId) {
                return fieldInfo;
            }
        }
    }

    public setFormValueProvider(provider: any) {
        this.formValueProvider = provider;
    }

    public getSourceFormValues() {
        return this.formValueProvider();
    }

    public prepareOptionsForDropDown(data: any) {
        const options: any = [];
        for (const singleOBj of data) {
            let objToUse = singleOBj;
            if (Validations.isNullOrUndefined(singleOBj.id)) {
                objToUse = {
                    id: singleOBj,
                }
            }
            options.push({
                value: objToUse.id,
                title: objToUse.title || objToUse.id
            })
        }
        return options;
    }

    public isFieldOptionExist(optionVal: IFormFieldOptions, options: IFormFieldOptions[]){
        if(!Validations.isNullOrUndefined(options) && options.length > 0){
            for(const singleOption of options){
                if(singleOption.value===optionVal.value){
                    return true;
                }
            }
        }
        return false;
    }


    public prepareNameWiseFields(fields: IFormField[]) {
        this.nameWiseFields = {};
        for (let f of fields) {
            this.nameWiseFields[f.id] = f;
        }
    }

    public getFieldDetails(name: string) {
        return this.nameWiseFields[name];
    }

    public getFieldValueBasedOnType(val: any, fieldInfo: IFormField) {
        let newValue = val;
        switch (fieldInfo.type) {
            case "autoComplete":
                newValue = val && val.value ? val.value : null;
                break;
        }
        return newValue;
    }

    public getFormValues(form: FormGroup, isFileUploadForm?: boolean, fileTypeFieldId?: any) {
        const currentValues = form.value;
        let fileValues;
        if (isFileUploadForm) {
            fileValues = new FormData();
            // in case of file upload we will change the form value with
            // with file names and prepare a formData with file objects 
            for (const fieldObj of fileTypeFieldId) {
                if (!Validations.isNullOrUndefined(currentValues[fieldObj.id])) {
                    if (fieldObj.isGroup) {
                        const groupFieldIndex = 0;
                        let fileIndex = 0;
                        for (const groupValues of currentValues[fieldObj.id]) {
                            for (const subFieldId of fieldObj.groupFieldIds) {
                                const filesUploadedInField = groupValues[subFieldId];
                                if (!Validations.isNullOrUndefined(filesUploadedInField)) {
                                    
                                    for (const fileValue of filesUploadedInField) {
                                        const newFileFieldValue = this.prepareFileFileValue(fileIndex, subFieldId);
                                        fileValues.append(newFileFieldValue, fileValue.file);
                                        if (!Validations.isNullOrUndefined(groupValues[subFieldId + "_hidden"])) {
                                            groupValues[subFieldId + "_hidden"] = newFileFieldValue;
                                        }
                                    }
                                } else {
                                    this.logger.logDebug("file values are not found")
                                    this.logger.logDebug(filesUploadedInField);
                                }
                            }
                            fileIndex++;
                        }
                    } else {
                        const filesUploadedInField = currentValues[fieldObj.id];
                        let fileIndex = 0;
                        for (const fileValue of filesUploadedInField) {
                            const newFileFieldValue = this.prepareFileFileValue(fileIndex, fieldObj.id);
                            fileValues.append(newFileFieldValue, fileValue.file);
                            fileIndex++;
                        }
                    }
                }
            }
        }
        return {
            formValues: currentValues,
            fileValues: fileValues,
        };
    }

    private prepareFileFileValue(index = 0, fileName: string) {
        return fileName + "_" + index + "_" + TimeUtils.getCurrentTime();
    }

    private getValueToSetAccordingToFieldType(field: IFormField, value: any) {
        if (field.type === "number" && value.trim && value.trim() !== "") {
            value = JSON.parse(value);
        }
        return value;
    }

    private isFieldApplicableToValidate(field: IFormField) {
        if (!Validations.isNullOrUndefined(field.disable) && field.disable) {
            return false;
        }
        if (!Validations.isNullOrUndefined(field.hidden) && field.hidden) {
            return false;
        }
        return true;
    }

    private getValueOfFieldToSet(field: IFormField, fieldDataObj: any) {
        let valueToSet = "";
        if (!Validations.isNullOrUndefined(fieldDataObj[field.id])) {
            if (field.type === "dropdown") {
                if (Validations.isArray(fieldDataObj[field.id])) {
                    field.options = this.prepareOptionsForDropDown(fieldDataObj[field.id]);
                } else {
                    field.options = this.prepareOptionsForDropDown([fieldDataObj[field.id]]);
                }
                valueToSet = field.options[0].value;
            } else {
                valueToSet = fieldDataObj[field.id];
            }
        }
        return valueToSet;
    }

}
