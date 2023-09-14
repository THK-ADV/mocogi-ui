import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map, tap } from 'rxjs'
import { MyModulesApiActions, MyModulesPageActions } from '../actions/my-modules.action'
import { Router } from '@angular/router'

@Injectable()
export class MyModuleEffects {

  showModule$ = createEffect(() => {
      return this.actions$.pipe(
      ofType(MyModulesPageActions.showModule),
      tap(({ moduleId }) => {
        console.log(moduleId)
        this.router.navigate(['/modules', moduleId])
      })
    )},
    { dispatch: false }
  )

  editModule$ = createEffect(() => {
      return this.actions$.pipe(
      ofType(MyModulesPageActions.editModule),
      tap(({ moduleId }) => {
        console.log(moduleId)
        this.router.navigate(['/modules', moduleId, 'edit'])
      })
    )},
    { dispatch: false }
  )

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
    private readonly router: Router,
  ) {
  }
}
