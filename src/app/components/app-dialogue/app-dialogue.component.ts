import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDialogueData } from '../../common/interfaces';

@Component({
  selector: 'app-app-dialogue',
  templateUrl: './app-dialogue.component.html',
  styleUrls: ['./app-dialogue.component.scss']
})
export class AppDialogueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogueData) {
    // TODO
  }

  ngOnInit() {
  }

}
