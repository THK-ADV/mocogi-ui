import { Injectable } from '@angular/core'
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { catchError, Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { AlertService } from '../alert/alert.service'
import { Alert } from '../alert/alert'

@Injectable()
export class HttpInterceptorDecorator implements HttpInterceptor {

  constructor(private alertService: AlertService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.handleError(next.handle(this.prefixBackendUrl(request)))
  }

  private prefixBackendUrl = (request: HttpRequest<unknown>): HttpRequest<unknown> =>
    request.clone({
      url: `${environment.backendUrl}/${request.url}`,
    })

  private handleError = (request: Observable<HttpEvent<unknown>>): Observable<HttpEvent<unknown>> =>
    request.pipe(catchError(this.handleError_))

  // https://angular.io/guide/http#getting-error-details
  private handleError_ = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if (error?.error) {
        const request = error.error.request || $localize`Unbekannte Anfrage`
        const message = error.error.message || $localize`Unbekannte Fehlernachricht`
        const alert: Alert = {
          type: 'danger',
          body: {
            kind: 'html',
            value: `<p><strong>Serverfehler in der Anfrage:</strong><br>${request}</p>\
                  <p><strong>Fehlernachricht:</strong><br>${message}</p>`,
          },
          autoDismiss: false,
        }
        this.alertService.report(alert)
      } else {
        console.error(`Backend returned code ${error.status}, body was: `, error.error)
      }
    }
    throw error
  }
}
