import { Component, OnInit, AfterViewInit } from '@angular/core';
//import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-topslider',
  templateUrl: './topslider.component.html',
  styleUrls: ['./topslider.component.scss']
})
export class TopsliderComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit() {
    if ($('.top_slider_bxslider').length) {
      $('.top_slider_bxslider').bxSlider({
        auto: true,
        moveSlides: 1,
        pagerCustom: '#bx-pager',
        animation: "slide",
        start: function (slider) {
          jQuery('body').removeClass('loading');
        }
      });
    }
  }
}
