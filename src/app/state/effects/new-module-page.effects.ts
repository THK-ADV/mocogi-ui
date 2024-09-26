import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of } from 'rxjs'
import {
  NewModuleApiActions,
  NewModulePageActions,
} from '../actions/new-module-page.actions'
import { NavigationActions } from '../actions/navigation.actions'

@Injectable()
export class NewModuleEffects {
  createModuleDraft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NewModulePageActions.save),
      exhaustMap(({ moduleCompendiumProtocol }) => {
        return this.service.createNewDraft(moduleCompendiumProtocol).pipe(
          map(() => NewModuleApiActions.savedChangesSuccess()),
          catchError(() => of(NewModuleApiActions.savedChangesFailure())),
        )
      }),
    )
  })

  goBack$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        NewModulePageActions.cancel,
        NewModuleApiActions.savedChangesSuccess,
      ),
      map(() => NavigationActions.navigate({ path: ['my-modules'] })),
    )
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {}
}
