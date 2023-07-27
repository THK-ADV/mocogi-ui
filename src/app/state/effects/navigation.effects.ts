import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ModulePageActions } from '../actions/module.actions'
import { map, tap } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { Router } from '@angular/router'
import { NavigationActions } from '../actions/navigation.actions'

@Injectable()
export class NavigationEffects {

  navigateToModuleDetail$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModulePageActions.selectModule),
        tap(({moduleId}) => this.router.navigate(['/show'], {state: {id: moduleId}})),
        map(() => NavigationActions.empty(),
        ),
      )
    },
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
    private readonly router: Router,
  ) {
  }
}
