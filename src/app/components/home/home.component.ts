import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/services/global';
import { Validations } from 'src/app/common/utility';
import { IWidgetInfo } from 'src/app/common/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  public recentWidget: IWidgetInfo;

  imageSources = [];
  height = '100%';

  constructor(private globals: Globals) { }

  public ngOnInit() {
    this.prepareStaticWidgets();
    const imageSources = this.globals.siteGlobals.imageUrls;
    if (!Validations.isNullOrUndefined(imageSources) && imageSources.length > 0) {
      this.imageSources = imageSources.split(',');
    }

  }

  private prepareStaticWidgets() {
    this.recentWidget = this.globals.getStaticWidget("UPCOMMINGTOURNAMENTLIST");
    
  }

}
