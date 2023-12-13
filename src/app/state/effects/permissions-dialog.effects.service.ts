import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { PermissionsDialogActions, PermissionsDialogApiActions } from '../actions/permissions-dialog.actions'
import { NavigationActions } from '../actions/navigation.actions'
import { HttpErrorResponse } from '@angular/common/http'
import { Store } from "@ngrx/store";
import { selectPermissions } from "../selectors/permissions-dialog.selector";

@Injectable()
export class PermissionsDialogEffects {

  fetchPermissions$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(PermissionsDialogActions.enter),
        exhaustMap(({moduleId}) =>
          this.service.getPermissions(moduleId).pipe(
            map((permissions) => PermissionsDialogApiActions.receivedPermissionsSuccessfully({ permissions }))
          )
        )
      )
    }
  )

  updatePermissions$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(PermissionsDialogActions.save),
        concatLatestFrom(() => this.store.select(selectPermissions)),
        exhaustMap(([{moduleId}, permissions]) => {
          return this.service.setPermissions(moduleId, permissions).pipe(
            map(() => {
              return NavigationActions.navigate({ path: [ 'my-modules' ] })
            }),
            catchError((error: HttpErrorResponse) => {
              return of(PermissionsDialogApiActions.savedChangesFailure(error.error))
            }))
        })
      )
    }
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {
  }
}
