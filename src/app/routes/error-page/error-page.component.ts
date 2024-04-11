import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'cops-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css'],
})
export class ErrorPageComponent {
  error: string
  constructor(route: ActivatedRoute) {
    this.error = route.snapshot.paramMap.get('error') ?? 'ERROR: Page not found'
  }
}
