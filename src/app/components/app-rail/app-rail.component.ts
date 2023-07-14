import { Component, Input } from '@angular/core';

export type CopsAppRailLink = {
  type: "LINK",
  text: string,
  icon: string,
  url: string,
};

export type CopsAppRailDivider = {
  type: "DIVIDER",
};

export type CopsAppRailItem = CopsAppRailLink | CopsAppRailDivider;

@Component({
  selector: 'cops-app-rail',
  templateUrl: './app-rail.component.html',
  styleUrls: ['./app-rail.component.scss']
})

export class AppRailComponent {
  @Input() railItems: Array<CopsAppRailItem> = [];
}
