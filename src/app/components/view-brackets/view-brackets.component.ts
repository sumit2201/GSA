import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppDataParent, RawData } from '../../common/app-data-format';
import { Validations } from '../../common/utility';
import { IWidgetInfo } from '../../common/interfaces';
import { STATICWIDGETS } from '../../../config/static-widget-info';
@Component({
  selector: 'app-view-brackets',
  templateUrl: './view-brackets.component.html',
  styleUrls: ['./view-brackets.component.scss']
})
export class ViewBracketsComponent implements OnInit {
  public widgetData: AppDataParent;
  public bracketTitlesData: any[];
  public activeBracket: any;
  public viewSingleBracketWidget: IWidgetInfo;
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.setViewSingleBracketWidget();
    this.prepareBracketTitlesData();
  }

  public prepareBracketTitlesData() {
    if (!Validations.isNullOrUndefined(this.widgetData) && this.widgetData.hasValidRawData()) {
      const rawData = this.widgetData.getRawData().data;
      this.bracketTitlesData = rawData;
      if (this.bracketTitlesData.length > 0 && Validations.isNullOrUndefined(this.activeBracket)) {
        this.activeBracket = this.bracketTitlesData[0];
      }
    }
  }

  public isBracketActive(singleBracketDetail: any) {
    if (!Validations.isNullOrUndefined(this.activeBracket)) {
      if (singleBracketDetail.bracketId === this.activeBracket.bracketId) {
        return true;
      }
    }
    return false;
  }

  public showBracketDetails(singleBracketDetail: any) {
    this.activeBracket = null;
    this.cdr.detectChanges();
    this.activeBracket = singleBracketDetail;
    this.cdr.detectChanges();
  }

  public prepareParameterForBracket() {
    if (!Validations.isNullOrUndefined(this.activeBracket)) {
      return {
        tournamentId: this.activeBracket.tournamentId,
        bracketId: this.activeBracket.bracketId
      }
    }
  }

  public setViewSingleBracketWidget() {
    this.viewSingleBracketWidget = STATICWIDGETS['VIEWSINGLEBRACKET'];
  }

}
