import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/services/global';
@Component({
  selector: 'app-dash-card',
  templateUrl: './dash-card.component.html',
  styleUrls: ['./dash-card.component.scss']
})
export class DashCardComponent implements OnInit {
  adminLinks: any[];
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.prepareAdminLinks();   
  }
public prepareAdminLinks() {
    const adminLinks = this.globals.prepareActionLinks("user");
    if (adminLinks.length) {
      this.adminLinks = adminLinks;
    }
  }
}
