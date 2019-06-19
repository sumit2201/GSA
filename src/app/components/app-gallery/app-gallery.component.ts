import { Component, OnInit, Input } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { AppDataParent } from '../../common/app-data-format';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';
import { Validations } from '../../common/utility';
import { Globals } from '../../services/global';

@Component({
  selector: 'app-app-gallery',
  templateUrl: './app-gallery.component.html',
  styleUrls: ['./app-gallery.component.scss']
})
export class AppGalleryComponent implements OnInit {
  public galleryImages: NgxGalleryImage[];
  public galleryOptions: NgxGalleryOptions[] = [];
  @Input() public widgetData: AppDataParent;
  constructor(private logger: LoggerService, private global: Globals
  ) {
    //
  }
  ngOnInit() {
    this.galleryOptions = [{image:true}];
    this.prepareGalleryData();
  }

  private prepareGalleryData() {
    if (!Validations.isNullOrUndefined(this.widgetData)
      && !Validations.isNullOrUndefined(this.widgetData.getRawData()) && !Validations.isNullOrUndefined(this.widgetData.getRawData().data)) {
      const data = this.widgetData.getRawData().data;
      const sourceFolder = this.global.getTeamGalleryPath();
      const thumbnailFolder = this.global.getTeamthumbnailPath();
      const imagesData = data;
      this.galleryImages = [];
      if (!Validations.isNullOrUndefined(imagesData)) {
        for (const imageObj of imagesData) {
          const galleryImgObj: any = {};
          const imageUrl = sourceFolder + "/" + imageObj.main_image;
          const thumbnailUrl = thumbnailFolder + "/" + imageObj.main_image;
          galleryImgObj.small = thumbnailUrl;
          galleryImgObj.medium = imageUrl;
          galleryImgObj.big = imageUrl;
          this.galleryImages.push(galleryImgObj);
        }
      } else {
        this.logger.logDebug("images not found in gallery data");
        this.logger.logDebug(this.widgetData);
      }
    } else {
      this.logger.logDebug("data is not valid for gallery");
      this.logger.logDebug(this.widgetData);
    }
  }
}