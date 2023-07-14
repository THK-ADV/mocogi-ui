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
    { type: 'LINK', text: 'Modulhandbücher', icon: 'apps', url: '#' },
    { type: 'LINK', text: 'Wahlpflichtfmodule', icon: 'apps', url: '#' },
    { type: 'HEADER', text: 'Verwaltung' },
    { type: 'LINK', text: 'Module', icon: 'apps', details: 'Änderungen', url: '#' },
    { type: 'LINK', text: 'Module', icon: 'apps', url: '#' },
  ];
  railItems: Array<CopsAppRailItem> = [
    { type: 'LINK', text: 'Modules', icon: 'description', url: '#' },
    { type: 'LINK', text: 'Schedule', icon: 'apps', url: '#' },
    { type: 'LINK', text: 'Rooms', icon: 'apps', url: '#' },
    { type: 'LINK', text: 'Exams', icon: 'apps', url: '#' },
    { type: 'DIVIDER' },
    { type: 'LINK', text: 'HOPS', icon: 'apps', url: '#' },
    { type: 'LINK', text: 'CAMS', icon: 'apps', url: '#' },
  ];
}