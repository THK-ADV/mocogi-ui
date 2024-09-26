import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import {
  MyModulesApiActions,
  MyModulesPageActions,
} from '../actions/my-modules.action'
import { Router } from '@angular/router'
import { fromPromise } from 'rxjs/internal/observable/innerFrom'

@Injectable()
export class MyModuleEffects {
  showLatestModule$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MyModulesPageActions.showLatestModule),
        exhaustMap(({ moduleId }) =>
          fromPromise(
            this.router.navigate(['/modules', moduleId], {
              queryParams: { source: 'latest' },
            }),
          ),
        ),
      )
    },
    { dispatch: false },
  )

  editModule$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MyModulesPageActions.editModule),
        exhaustMap(({ moduleId }) =>
          fromPromise(this.router.navigate(['/modules', moduleId, 'edit'])),
        ),
      )
    },
    { dispatch: false },
  )

  requestReview = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MyModulesPageActions.requestReview,
        MyModulesPageActions.publishModule,
      ),
      exhaustMap(({ moduleId }) =>
        this.service
          .requestReview(moduleId)
          .pipe(map(() => MyModulesPageActions.enter())),
      ),
    )
  })

  cancelReview = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.cancelReview),
      exhaustMap(({ moduleId }) =>
        this.service
          .cancelReview(moduleId)
          .pipe(map(() => MyModulesPageActions.enter())),
      ),
    )
  })

  discardChanges = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.discardChanges),
      exhaustMap(({ moduleId }) =>
        this.service
          .deleteDraft(moduleId)
          .pipe(map(() => MyModulesPageActions.enter())),
      ),
    )
  })

  fetchModeratedModules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyModulesPageActions.enter),
      exhaustMap(() =>
        this.service.moderatedModules().pipe(
          map((moderatedModules) =>
            MyModulesApiActions.retrievedModeratedModulesSuccess({
              moderatedModules,
            }),
          ),
        ),
      ),
    )
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
    private readonly router: Router,
  ) {}
}
