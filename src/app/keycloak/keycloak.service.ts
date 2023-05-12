import { Injectable } from '@angular/core'
import { KeycloakService as KeycloakService_ } from 'keycloak-angular'
import { fromPromise } from 'rxjs/internal/observable/innerFrom'
import { asRecord, parse, parseOptional } from '../parser/record-parser'
import { toString } from '../parser/type-conversions'
import { map, Observable, of, switchMap } from 'rxjs'
import { KeycloakProfile } from 'keycloak-js'

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  constructor(private readonly service: KeycloakService_) {

  }

  personAbbrev$ = (): Observable<string | undefined> =>
    this.userProfile$().pipe(
      map(p => p && this.parsePersonAbbrev(p))
    )

  private userProfile$ = (): Observable<KeycloakProfile | undefined> =>
    fromPromise(this.service.isLoggedIn()).pipe(
      switchMap(isLoggedIn =>
        isLoggedIn ? fromPromise(this.service.loadUserProfile()) : of(undefined)
      )
    )

  private parsePersonAbbrev = (p: KeycloakProfile): string | undefined => {
    return parse('attributes', asRecord(p), v => {
      return parseOptional('core_person_abbrev', asRecord(v), v => {
        return Array.isArray(v) && v.length === 1 ? toString(v[0]) : undefined
      })
    })
  }
}
