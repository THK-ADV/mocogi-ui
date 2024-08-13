import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { NewModuleApiActions, NewModulePageActions } from '../actions/new-module-page.actions'
import { NavigationActions } from '../actions/navigation.actions'

@Injectable()
export class NewModuleEffects {
  createModuleDraft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewModulePageActions.save),
      exhaustMap(({moduleCompendiumProtocol}) => {
        return this.service.createNewDraft(moduleCompendiumProtocol).pipe(
          map(() => NewModuleApiActions.savedChangesSuccess()),
          catchError((error: HttpErrorResponse) => of(NewModuleApiActions.savedChangesFailure(error.error))))
      })
    )
  })

  goBack$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewModulePageActions.cancel, NewModuleApiActions.savedChangesSuccess),
      map(() => NavigationActions.navigate({path: ['my-modules']}))
    )
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
