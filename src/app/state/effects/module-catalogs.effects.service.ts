import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { ModuleCatalogsApiActions, ModuleCatalogsPageActions } from "../actions/module-catalogs.actions";
import { generateCurrentSemester } from "../../helper/semester.helper";

@Injectable()
export class ModuleCompendiumEffects {

  fetchModuleCompendiums$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleCatalogsPageActions.enter),
        exhaustMap(() =>
          this.service.allModuleCatalogs(generateCurrentSemester().id).pipe(
            map((moduleCatalogs) => ModuleCatalogsApiActions.retrievedModulesCatalogsSuccess({ moduleCatalogs })),
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
