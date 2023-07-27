import { Component, OnDestroy } from '@angular/core'
import { debounceTime, Subscription } from 'rxjs'
import { Alert } from './alert'
import { AlertService } from './alert.service'
import { NavigationStart, Router } from '@angular/router'

@Component({
  selector: 'cops-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnDestroy {
  private subs: Subscription[]
  alerts: Alert[] = []

  constructor(private service: AlertService, private router: Router) {
    const alerts$ = service.alerts$()
    const s1 = alerts$
      .subscribe(a => this.alerts.push(a))
    const s2 = alerts$.pipe(debounceTime(5000))
      .subscribe(a => a.autoDismiss && this.closing(a))
    const s3 = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alerts = []
      }
    })
    this.subs = [s1, s2, s3]
  }

  ngOnDestroy() {
    this.subs.forEach(_ => _.unsubscribe())
  }

  closing = (alert: Alert) => {
    this.alerts.splice(this.alerts.indexOf(alert), 1)
  }
}
