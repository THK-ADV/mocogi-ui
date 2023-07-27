import { Component } from '@angular/core';
import { CopsNavigationItem } from './components/nav-bar/nav-bar.component';
import { CopsAppRailItem } from './components/app-rail/app-rail.component';

@Component({
  selector: 'cops-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  navItems: Array<CopsNavigationItem> = [
    { type: 'HEADER', text: 'Übersicht' },
    { type: 'LINK', text: 'Module', icon: 'description', url: '#' },
    // { type: 'LINK', text: 'Modulhandbücher', icon: 'apps', url: '#' },
    { type: 'HEADER', text: 'Verwaltung' },
    { type: 'LINK', text: 'Änderungen', icon: 'apps', url: 'modules' },
    // { type: 'LINK', text: 'Freigaben', icon: 'apps', url: '#' },
  ];
  railItems: Array<CopsAppRailItem> = [
    { type: 'LINK', text: 'Modules', icon: 'description', url: '#', disabled: false },
    { type: 'LINK', text: 'Schedule', icon: 'apps', url: '#', disabled: true },
    { type: 'LINK', text: 'Rooms', icon: 'apps', url: '#', disabled: true },
    { type: 'LINK', text: 'Exams', icon: 'apps', url: '#', disabled: true },
    { type: 'DIVIDER' },
    { type: 'SPACER' },
    { type: 'LINK', text: 'Feedback', icon: 'feedback', url: '#', disabled: true },
    { type: 'LINK', text: 'Impressum', icon: 'info', url: 'https://www.th-koeln.de/hochschule/impressum_8159.php', disabled: false },
  ];
}