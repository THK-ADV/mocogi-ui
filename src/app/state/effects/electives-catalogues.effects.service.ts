import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { ElectivesCatalogsPageActions, ElectivesCatalogsApiActions } from '../actions/electives-catalogues.actions'

@Injectable()
export class ElectivesCatalogsEffects {

  fetchElectivesCatalogues$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ElectivesCatalogsPageActions.enter),
        exhaustMap(() =>
          this.service.allElectivesCatalogues('wise_2023').pipe(
            map((electivesCatalogues) => ElectivesCatalogsApiActions.retrievedElectivesCatalogsSuccess({ electivesCatalogues })),
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
