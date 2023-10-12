import { Component, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { NavigationActions } from '../../state/actions/navigation.actions'

export type CopsNavigationLink = {
  type: 'LINK',
  text: string
  icon: string,
  details?: string,
  url: string[]
};

export type CopsNavigationHeader = {
  type: 'HEADER',
  text: string,
};

export type CopsNavigationItem = CopsNavigationHeader | CopsNavigationLink;

@Component({
  selector: 'cops-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  @Input() navItems: Array<CopsNavigationItem> = []
  constructor(private store: Store) {
  }
  navigateTo(url: Array<string>) {
    this.store.dispatch(NavigationActions.navigate({ path: url }))
  }
}
