import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { ModuleCompendiumsApiActions, ModuleCompendiumsPageActions } from "../actions/module-compendiums.actions";

@Injectable()
export class ModuleCompendiumEffects {

  fetchModuleCompendiums$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleCompendiumsPageActions.enter),
        exhaustMap(() =>
          this.service.allModuleCompendiums('wise_2023').pipe(
            map((moduleCompendiums) => ModuleCompendiumsApiActions.retrievedModulesCompendiumsSuccess({ moduleCompendiums })),
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
