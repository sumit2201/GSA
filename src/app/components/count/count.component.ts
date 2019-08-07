import { Component, OnInit, AfterViewInit } from '@angular/core';
//declare var $: any;
import * as $ from 'jquery';
@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {

  }
  ngAfterViewInit() {
  //   if (jQuery('.word-count').length) {
  //     jQuery(".word-count").counterUp({
  //         delay: 10,
  //         time: 1000
  //     });
  // }

  }

}
