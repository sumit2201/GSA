import { Component, OnInit} from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit{

  constructor() { }

  ngOnInit() {
    (function ($) {
      if (jQuery('.word-count').length) {
        $('.word-count').counterUp({
          delay: 10,
          time: 5000
        });
      } (jQuery);
    }
    )
  }
}
