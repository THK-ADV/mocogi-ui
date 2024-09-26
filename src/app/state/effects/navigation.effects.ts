import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ModulePageActions } from '../actions/module.actions'
import { exhaustMap } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { Router } from '@angular/router'
import { NavigationActions } from '../actions/navigation.actions'
import { fromPromise } from 'rxjs/internal/observable/innerFrom'

@Injectable()
export class NavigationEffects {
  navigateToModuleDetail$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ModulePageActions.selectModule),
        exhaustMap(({ moduleId }) =>
          fromPromise(this.router.navigate(['/modules', moduleId])),
        ),
      )
    },
    { dispatch: false },
  )

  navigateToRoute$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NavigationActions.navigate),
        exhaustMap(({ path }) => fromPromise(this.router.navigate(path))),
      )
    },
    { dispatch: false },
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
    private readonly router: Router,
  ) {}
}
