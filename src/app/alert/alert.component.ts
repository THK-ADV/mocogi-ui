import { Component, inject, OnDestroy } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AlertStore } from './alert-store'

@Component({
  selector: 'cops-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  standalone: false,
})
export class AlertComponent implements OnDestroy {
  readonly store = inject(AlertStore)
  readonly sub: Subscription

  constructor(private router: Router) {
    this.sub = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.store.removeAll()
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
