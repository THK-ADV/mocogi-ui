import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ModulePageActions } from '../actions/module.actions'
import { tap } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { Router } from '@angular/router'
import { NavigationActions } from '../actions/navigation.actions'

@Injectable()
export class NavigationEffects {

  navigateToModuleDetail$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModulePageActions.selectModule),
        tap(({moduleId}) => this.router.navigate(['/show'], {state: {id: moduleId}})),
      )
    },
    { dispatch: false }
  )

  navigateToRoute$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(NavigationActions.navigate),
        tap(({ path }) => this.router.navigate(path)),
      )
    },
    { dispatch: false }
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
    private readonly router: Router,
  ) {
  }
}
