import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ModuleApiActions, ModulePageActions } from '../actions/module.actions'
import { exhaustMap, map } from 'rxjs'

@Injectable()
export class ModuleEffects {

  fetchModules$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModulePageActions.enter),
        exhaustMap(() =>
          this.service.allModuleMetadata().pipe(
            map((modules) => ModuleApiActions.retrievedModulesSuccess({modules})),
          ),
        ),
      )
    },
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
