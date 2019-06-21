import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionExecutorDirective } from 'src/app/directives/action-executor.directive';
import { LoggerService } from './services/log-provider.service';
import { StorageService } from '../../services/storage';
import { WidgetLoaderComponent } from '../../components/widgetloader/widget-loader.component';
import { AppMaterialModule } from '../material-module/material-module';
import { InputFileConfig, InputFileModule } from 'ngx-input-file';
import { NgxGalleryModule } from 'ngx-gallery';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SafeHtmlPipe } from 'src/app/pipes/safe-html';
 
const config: InputFileConfig = {};
@NgModule({
  declarations: [
    ActionExecutorDirective,
    WidgetLoaderComponent,
    SafeHtmlPipe,

  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    InputFileModule.forRoot(config),
    NgxGalleryModule,
    EditorModule,
    // FlexLayoutModule
  ],
  exports:[
    ActionExecutorDirective,
    WidgetLoaderComponent,
    InputFileModule,
    NgxGalleryModule,
    EditorModule,
    SafeHtmlPipe
    // FlexLayoutModule
  ],
  providers:[
    LoggerService,
    StorageService,
  ]
})
export class ArchitectureModule { }
