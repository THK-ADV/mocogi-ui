import { Injectable } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, exhaustMap, map, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { NavigationActions } from '../actions/navigation.actions'
import { ModuleApprovalApiActions, ModuleApprovalPageActions } from '../actions/module-approval-page.actions'

@Injectable()
export class ModuleApprovalEffects {
  approve$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleApprovalPageActions.approve),
        exhaustMap(({ moduleId, approvalId, comment}) => {
          return this.service.submitApproval(moduleId, approvalId, 'approve', comment).pipe(
            map(() => {
              return NavigationActions.navigate({path: ['module-approvals']})
            }),
            catchError((error: HttpErrorResponse) => {
              return of(ModuleApprovalApiActions.moduleApprovalFailed(error.error))
            }))
        })
      )
    }
  )

  reject = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleApprovalPageActions.reject),
        exhaustMap(({ moduleId, approvalId, comment}) => {
          return this.service.submitApproval(moduleId, approvalId, 'reject', comment).pipe(
            map(() => {
              return NavigationActions.navigate({path: ['module-approvals']})
            }),
            catchError((error: HttpErrorResponse) => {
              return of(ModuleApprovalApiActions.moduleApprovalFailed(error.error))
            }))
        })
      )
    }
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
