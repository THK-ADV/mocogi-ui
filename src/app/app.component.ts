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
    { type: 'HEADER', text: 'Übersicht' },
    { type: 'LINK', text: 'Modulsuche', icon: 'search', url: ['/'] },
    { type: 'LINK', text: 'Modulhandbücher', icon: 'book', url: ['module-compendium-lists'] },
    { type: 'LINK', text: 'WPF Listen', icon: 'list-document', url: ['elective-modules-lists'] },
    { type: 'HEADER', text: 'Verwaltung' },
    { type: 'LINK', text: 'Meine Module', icon: 'update', url: ['my-modules'] },
    { type: 'LINK', text: 'Änderungsfreigaben', icon: 'approval', url: ['module-approvals'] },
  ]
  railItems: Array<CopsAppRailItem> = [
    { type: 'LINK', text: 'Modules', image: '/assets/icons/modules.svg', url: '', disabled: false, active: true },
    { type: 'LINK', text: 'Schedule', image: '/assets/icons/schedule.svg', url: '', disabled: true },
    { type: 'LINK', text: 'Rooms', image: '/assets/icons/rooms.svg', url: '', disabled: true },
    { type: 'LINK', text: 'Exams', image: '/assets/icons/exams.svg', url: '', disabled: true },
    { type: 'DIVIDER' },
    { type: 'SPACER' },
    { type: 'LINK', text: 'Feedback', icon: 'feedback', url: 'mailto:schedule-dev@gm.fh-koeln.de?subject=Feedback für COPS (Modules)', disabled: false },
    { type: 'LINK', text: 'Impressum', icon: 'info', url: 'https://www.th-koeln.de/hochschule/impressum_8159.php', disabled: false },
  ]
}