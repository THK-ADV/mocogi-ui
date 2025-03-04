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
        this.service
          .allModuleAtomic()
          .pipe(
            map((modules) =>
              ModuleApiActions.retrievedModulesSuccess({ modules }),
            ),
          ),
      ),
    )
  })

  fetchLastModuleUpdateDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModulePageActions.enter),
      exhaustMap(() =>
        this.service.latestModuleUpdate().pipe(
          map((latestModuleUpdate) =>
            ModuleApiActions.retrievedLatestModuleUpdate({
              latestModuleUpdate,
            }),
          ),
        ),
      ),
    )
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {}
}
