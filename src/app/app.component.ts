import { Component } from '@angular/core'
import { CopsNavigationItem } from './components/nav-bar/nav-bar.component'
import { CopsAppRailItem } from './components/app-rail/app-rail.component'

@Component({
  selector: 'cops-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  navItems: Array<CopsNavigationItem> = [
    {
      type: 'HEADER',
      text: $localize`Übersicht`,
    },
    {
      type: 'LINK',
      text: $localize`Modulsuche`,
      icon: 'search',
      url: ['/'],
    },
    {
      type: 'LINK',
      text: $localize`Modulhandbücher`,
      icon: 'book',
      url: ['module-catalog-lists'],
    },

    {
      type: 'LINK',
      text: $localize`WPF Listen`,
      icon: 'list-document',
      url: ['elective-modules-lists'],
    },
    {
      type: 'HEADER',
      text: $localize`Verwaltung`,
    },
    {
      type: 'LINK',
      text: $localize`Meine Module`,
      icon: 'update',
      url: ['my-modules'],
    },
    {
      type: 'LINK',
      text: $localize`Änderungsfreigaben`,
      icon: 'approval',
      url: ['module-approvals'],
    },
    {
      type: 'LINK',
      text: $localize`Modulhandbücher Vorschau`,
      icon: 'book',
      url: ['module-catalog-lists-preview'],
    },
  ]
  railItems: Array<CopsAppRailItem> = [
    {
      type: 'LINK',
      text: $localize`Module`,
      image: '/assets/icons/modules.svg',
      url: '',
      disabled: false,
      active: true,
    },
    {
      type: 'LINK',
      text: $localize`Stundenplan`,
      image: '/assets/icons/schedule.svg',
      url: '',
      disabled: true,
    },
    {
      type: 'LINK',
      text: $localize`Räume`,
      image: '/assets/icons/rooms.svg',
      url: '',
      disabled: true,
    },
    {
      type: 'LINK',
      text: $localize`Prüfungen`,
      image: '/assets/icons/exams.svg',
      url: '',
      disabled: true,
    },
    { type: 'DIVIDER' },
    { type: 'SPACER' },
    {
      type: 'LINK',
      text: $localize`Feedback`,
      icon: 'feedback',
      url: 'mailto:schedule-dev@gm.fh-koeln.de?subject=Feedback für COPS (Modules)',
      disabled: false,
    },
    {
      type: 'LINK',
      text: $localize`Impressum`,
      icon: 'info',
      url: 'https://www.th-koeln.de/hochschule/impressum_8159.php',
      disabled: false,
    },
  ]
}
