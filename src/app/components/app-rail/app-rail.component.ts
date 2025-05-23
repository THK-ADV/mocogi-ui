import { Component, Input } from '@angular/core'

export type CopsAppRailLink = {
  type: 'LINK'
  text: string
  icon?: string
  image?: string
  url: string
  disabled: boolean
  active?: boolean
}

export type CopsAppRailDivider = {
  type: 'DIVIDER'
}

export type CopsAppRailSpacer = {
  type: 'SPACER'
}

export type CopsAppRailItem =
  | CopsAppRailLink
  | CopsAppRailDivider
  | CopsAppRailSpacer

@Component({
  selector: 'cops-app-rail',
  templateUrl: './app-rail.component.html',
  styleUrls: ['./app-rail.component.scss'],
  standalone: false,
})
export class AppRailComponent {
  @Input() railItems: Array<CopsAppRailItem> = []
}
