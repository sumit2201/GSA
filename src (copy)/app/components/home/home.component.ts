import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnInit {

  
  imageSources = [];
  height = '100%';

  constructor( private globals: Globals ) { }

  public ngOnInit() {
      const imageSources = this.globals.siteGlobals.imageUrls;

    this.imageSources = imageSources.split(',');  
      
  }

}
