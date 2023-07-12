import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'

@Component({
  selector: 'sched-th-koeln-bar',
  templateUrl: './th-koeln-bar.component.html',
  styleUrls: ['./th-koeln-bar.component.css'],
  standalone: true,
  imports: [
    MatSidenavModule,
  ]
})
export class ThKoelnBarComponent {

}
