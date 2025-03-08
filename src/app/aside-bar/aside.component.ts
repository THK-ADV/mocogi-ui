import { Component } from '@angular/core';
import { ViewportServiceService } from "../viewport-service.service"

@Component({
  selector: 'cops-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  standalone: false
})
export class AsideComponent {
  isMobile$ = this.viewportService.isMobile$

  constructor(private viewportService: ViewportServiceService) {}

}
