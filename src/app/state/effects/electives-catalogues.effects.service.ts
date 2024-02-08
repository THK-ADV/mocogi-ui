import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { ElectivesCataloguesPageActions, ElectivesCataloguesApiActions } from '../actions/electives-catalogues.actions'

@Injectable()
export class ElectivesCataloguesEffects {

  fetchElectivesCatalogues$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ElectivesCataloguesPageActions.enter),
        exhaustMap(() =>
          this.service.allElectivesCatalogues('wise_2023').pipe(
            map((electivesCatalogues) => ElectivesCataloguesApiActions.retrievedElectivesCataloguesSuccess({ electivesCatalogues })),
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
