import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Alert } from './alert'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<Alert>()

  alerts$ = () =>
    this.alertSubject.asObservable()

  report = (alert: Alert) =>
    this.alertSubject.next(alert)
}
