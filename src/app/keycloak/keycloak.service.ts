import { Injectable } from '@angular/core'
import { KeycloakEvent, KeycloakService as KeycloakService_ } from 'keycloak-angular'
import { fromPromise } from 'rxjs/internal/observable/innerFrom'
import { Observable, of, switchMap } from 'rxjs'
import { KeycloakProfile } from 'keycloak-js'

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {

  constructor(private readonly service: KeycloakService_) {

  }

  events$(): Observable<KeycloakEvent> {
    return this.service.keycloakEvents$.asObservable()
  }

  userProfile$(): Observable<KeycloakProfile | undefined> {
    return fromPromise(this.service.isLoggedIn()).pipe(
      switchMap(isLoggedIn =>
        isLoggedIn ? fromPromise(this.service.loadUserProfile()) : of(undefined),
      ),
    )
  }
}
