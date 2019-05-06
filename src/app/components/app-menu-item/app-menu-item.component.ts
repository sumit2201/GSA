import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IAppMenuItem, IActionInfo } from '../../common/interfaces';
import { Globals } from '../../services/global';
import { AccessProviderService } from '../../services/access-provider';
import { LoggerService } from '../../modules/architecture-module/services/log-provider.service';


@Component({
  selector: 'app-menu-item',
  templateUrl: './app-menu-item.component.html',
  styleUrls: ['./app-menu-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class AppMenuItemComponent implements OnInit {
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() menuItem: IAppMenuItem;
  @Input() depth: number;
  @Input() actions: IActionInfo[];
  constructor(private logger: LoggerService,private globals: Globals, private accessProvider: AccessProviderService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    // TODO;
  }

  public getParamValues(dataItem: any) {
    return {
      menuId: dataItem.id,
    }
  }

  public onItemSelected(item: IAppMenuItem) {
    if (!item.children || !item.children.length) {
      // this.router.navigate([item.route]);
      // this.navService.closeNav();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  public handleEditRequest(event: Event) {
    console.error(event);
    event.preventDefault();
    event.stopImmediatePropagation();
    console.error("wow edit request");
}

  public hasAccess(feature: string) {
    return this.accessProvider.hasAccess(feature);
  }

}
