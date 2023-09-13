import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ModuleApiActions, ModulePageActions } from '../actions/module.actions'
import { exhaustMap, map } from 'rxjs'
import { MyModulesApiActions, MyModulesPageActions } from '../actions/my-modules.action'

@Injectable()
export class MyModuleEffects {

  fetchModules$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(MyModulesPageActions.enter),
        exhaustMap(() =>
          this.service.ownModules().pipe(
            map((modules) => {
              console.log(modules)
              return MyModulesApiActions.retrievedModulesSuccess({ modules })
            }),
          ),
        ),
      )
    },
  )

  fetchModuleDrafts$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(MyModulesPageActions.enter),
        exhaustMap(() =>
          this.service.ownModuleDrafts().pipe(
            map((moduleDrafts) => MyModulesApiActions.retrievedModuleDraftsSuccess({ moduleDrafts })),
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
