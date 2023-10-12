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
        tap(({moduleId}) => this.router.navigate([ '/modules', moduleId ]))
      )
    },
    {dispatch: false}
  )

  editModule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.editModule),
      tap(({moduleId}) => this.router.navigate([ '/modules', moduleId, 'edit' ]))
    )
  },{ dispatch: false })

  requestReview = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.requestReview, MyModulesPageActions.publishModule),
      exhaustMap(({ moduleId }) => this.service.createReview(moduleId).pipe(
        map(() => MyModulesPageActions.enter()))
      )
    )
  })

  cancelReview = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.cancelReview),
      exhaustMap(({ moduleId }) => this.service.deleteReview(moduleId).pipe(
        map(() => MyModulesPageActions.enter()))
      )
    )
  })

  discardChanges = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.discardChanges),
      exhaustMap(({ moduleId }) => this.service.deleteDraft(moduleId).pipe(
        map(() => MyModulesPageActions.enter()))
      ))
    }
  )

  fetchModeratedModules$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(MyModulesPageActions.enter),
        exhaustMap(() =>
          this.service.moderatedModules().pipe(
            map((moderatedModules) =>
              MyModulesApiActions.retrievedModeratedModulesSuccess({moderatedModules}))
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
