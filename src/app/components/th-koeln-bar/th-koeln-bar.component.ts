import { Component } from '@angular/core'
import { MatSidenavModule } from '@angular/material/sidenav'

@Component({
  selector: 'cops-th-koeln-bar',
  templateUrl: './th-koeln-bar.component.html',
  styleUrls: ['./th-koeln-bar.component.scss'],
  standalone: true,
  imports: [MatSidenavModule],
})
export class ThKoelnBarComponent {}
