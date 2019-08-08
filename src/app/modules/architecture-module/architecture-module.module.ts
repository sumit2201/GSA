import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionExecutorDirective } from 'src/app/directives/action-executor.directive';
import { LoggerService } from './services/log-provider.service';
import { StorageService } from '../../services/storage';
import { WidgetLoaderComponent } from '../../components/widgetloader/widget-loader.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SafeHtmlPipe } from 'src/app/pipes/safe-html';
import { AppAlertComponent } from 'src/app/components/app-alert/app-alert.component';
 

@NgModule({
  declarations: [
    ActionExecutorDirective,
    WidgetLoaderComponent,
    SafeHtmlPipe,
    AppAlertComponent,

  ],
  imports: [
    CommonModule,
    NgxGalleryModule,
    EditorModule,
    // FlexLayoutModule
  ],
  exports:[
    ActionExecutorDirective,
    WidgetLoaderComponent,
    NgxGalleryModule,
    EditorModule,
    SafeHtmlPipe,
    AppAlertComponent
    // FlexLayoutModule
  ],
  providers:[
    LoggerService,
    StorageService,
  ]
})
export class ArchitectureModule { }
