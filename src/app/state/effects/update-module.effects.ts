import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of } from 'rxjs'
import {
  UpdateModuleApiActions,
  UpdateModulePageActions,
} from '../actions/update-module-page.actions'
import { HttpErrorResponse } from '@angular/common/http'
import { NavigationActions } from '../actions/navigation.actions'

@Injectable()
export class UpdateModuleEffects {
  updateModuleDraft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UpdateModulePageActions.save),
      exhaustMap(({ moduleId, moduleCompendiumProtocol }) => {
        return this.service
          .updateModuleDraft(moduleId, moduleCompendiumProtocol)
          .pipe(
            map(() => UpdateModuleApiActions.savedChangesSuccess()),
            catchError((error: HttpErrorResponse) =>
              of(UpdateModuleApiActions.savedChangesFailure(error.error)),
            ),
          )
      }),
    )
  })

  goBack$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        UpdateModuleApiActions.savedChangesSuccess,
        UpdateModulePageActions.cancel,
      ),
      map(() => NavigationActions.navigate({ path: ['my-modules'] })),
    )
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {}
}
