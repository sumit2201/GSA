import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInfo } from 'src/app/common/interfaces';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() widget : IWidgetInfo;
  constructor() { }

  ngOnInit() {
    this.widget;
  }

}
