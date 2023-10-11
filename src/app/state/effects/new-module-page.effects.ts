import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of } from 'rxjs'
import { UpdateModuleApiActions } from '../actions/update-module-page.actions'
import { HttpErrorResponse } from '@angular/common/http'
import { NewModulePageActions } from '../actions/new-module-page.actions'

@Injectable()
export class NewModuleEffects {
  createModuleDraft$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(NewModulePageActions.save),
        exhaustMap(({ moduleCompendiumProtocol }) => {
          return this.service.createNewDraft(moduleCompendiumProtocol).pipe(
            map(() => {
              return UpdateModuleApiActions.savedChangesSuccess()
            }),
            catchError((error: HttpErrorResponse) => {
              return of(UpdateModuleApiActions.savedChangesFailure(error.error))
            }))
        })
      )
    }
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
