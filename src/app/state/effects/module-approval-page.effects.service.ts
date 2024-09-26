import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { NavigationActions } from '../actions/navigation.actions'
import { ModuleApprovalPageActions } from '../actions/module-approval-page.actions'

@Injectable()
export class ModuleApprovalEffects {
  approve$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModuleApprovalPageActions.approve),
      exhaustMap(({ moduleId, approvalId, comment }) => {
        return this.service
          .submitApproval(moduleId, approvalId, 'approve', comment)
          .pipe(
            map(() =>
              NavigationActions.navigate({ path: ['module-approvals'] }),
            ),
          )
      }),
    )
  })

  reject = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModuleApprovalPageActions.reject),
      exhaustMap(({ moduleId, approvalId, comment }) => {
        return this.service
          .submitApproval(moduleId, approvalId, 'reject', comment)
          .pipe(
            map(() =>
              NavigationActions.navigate({ path: ['module-approvals'] }),
            ),
          )
      }),
    )
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {}
}
