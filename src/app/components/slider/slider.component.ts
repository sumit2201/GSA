import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if ($('.flexslider').length) {
      (jQuery('.flexslider') as any).flexslider({
        animation: "slide",
        start: function (slider) {
          jQuery('body').removeClass('loading');
        }
      });
    }
  }


}
  