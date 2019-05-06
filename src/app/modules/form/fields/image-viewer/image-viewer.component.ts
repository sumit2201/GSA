import { Component, OnInit, Input } from '@angular/core';
import { Validations, CommonUtils } from "../../../../common/utility";
import { Globals } from '../../../../services/global';
import { IFormField } from '../../../../common/interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})

export class ImageViewerComponent implements OnInit {
  @Input() public field: IFormField;
  @Input() public form: FormGroup;
  public imageDetails: any;
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.prepareImageData();
    this.setImageFieldLoader();
  }

  private setImageFieldLoader() {
    this.field.imageFieldLoader = this.prepareImageData.bind(this);
  }

  public getCustomClass() {
    if (!Validations.isNullOrUndefined(this.field.customClass) && this.field.customClass) {
      return this.field.customClass;
    }
    return "";
  }

  private prepareImageData() {
    this.imageDetails = null;
    if (!Validations.isNullOrUndefined(this.field.imageSource)
      && this.field.imageSource
      && !Validations.isNullOrUndefined(this.field.value) && this.field.value) {
      let imagePath = null;
      switch (this.field.imageSource) {
        case "teamRoster":
          imagePath = this.globals.getTeamRosterPath();
          break;
        case "teamGallery":
          imagePath = this.globals.getTeamGalleryPath();
          break;
        case "teamBanner":
          imagePath = this.globals.getTeamBannerPath();
          break;
      }
      if (!Validations.isNullOrUndefined(imagePath)) {
        const imageDetails: any = {};
        imagePath = imagePath + "/" + this.field.value;
        imageDetails.src = imagePath;
        this.imageDetails = imageDetails;
      }
    }
  }

}
