import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
// components
import { DynamicFormBuilderComponent } from "./dynamic-form-builder.component";
import { FieldBuilderComponent } from "./field-builder/field-builder.component";
import { TextBoxComponent } from "./fields/text/textbox-input.component";
import { DropDownComponent } from "./fields/dropDown/dropdown-input.component";
import { FileComponent } from "./fields/file/file-input.component";
import { CheckBoxComponent } from "./fields/checkbox/checkbox-input.component";
import { RadioComponent } from "./fields/radio/radio-input.component";
import { ActionButtonComponent } from "./fields/button/button-input.component";
import { ListInputComponent } from './fields/listInput/list-input.component';
import { ArchitectureModule } from "../architecture-module/architecture-module.module";
import { RichTextInputComponent } from './fields/rich-text/rich-text-input.component';
import { AppMaterialModule } from "../material-module/material-module";
import { GroupInputComponent } from './fields/group-input/group-input.component';
import { DateInputComponent } from './fields/date-input/date-input.component';
import { FormFieldManager } from "../../services/form-field-manager";
import { AutoCompleteInputComponent } from './fields/auto-complete-input/auto-complete-input.component';
import { PlainTextInputComponent } from './fields/plain-text-input/plain-text-input.component';
import { RouterModule } from "@angular/router";
import { ROUTES } from "../../app.routes";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { ImageViewerComponent } from './fields/image-viewer/image-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    ArchitectureModule,
    RouterModule.forChild(ROUTES),
    AngularEditorModule
  ],
  declarations: [
    DynamicFormBuilderComponent,
    FieldBuilderComponent,
    TextBoxComponent,
    DropDownComponent,
    CheckBoxComponent,
    FileComponent,
    RadioComponent,
    ActionButtonComponent,
    ListInputComponent,
    RichTextInputComponent,
    GroupInputComponent,
    DateInputComponent,
    AutoCompleteInputComponent,
    PlainTextInputComponent,
    ImageViewerComponent,
  ],
  exports: [DynamicFormBuilderComponent, PlainTextInputComponent],
  providers: [FormFieldManager]
})
export class DynamicFormBuilderModule { }
