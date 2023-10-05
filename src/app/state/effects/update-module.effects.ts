import {Injectable} from '@angular/core'
import {HttpService} from '../../http/http.service'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, exhaustMap, map, of} from 'rxjs'
import {UpdateModuleApiActions, UpdateModulePageActions} from '../actions/update-module-page.actions'
import {HttpErrorResponse} from '@angular/common/http'

@Injectable()
export class UpdateModuleEffects {
  updateModuleDraft$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(UpdateModulePageActions.save),
        exhaustMap(({moduleId, moduleCompendiumProtocol, dirtyKeys}) => {
          return this.service.updateModuleDraft(moduleId, moduleCompendiumProtocol, dirtyKeys).pipe(
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
