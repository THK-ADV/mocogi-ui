import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { Approval } from '../../types/approval'
import { inject } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { pipe, switchMap } from 'rxjs'
import { tapResponse } from '@ngrx/operators'

export const ApprovalStore = signalStore(
  withState({ approvals: new Array<Approval>() }),
  withMethods((store, http = inject(HttpService)) => {
    return {
      load: rxMethod<void>(
        pipe(
          switchMap(() =>
            http.ownApprovals().pipe(
              tapResponse({
                next: (approvals) => patchState(store, { approvals }),
                error: (err) => console.error(err),
              }),
            ),
          ),
        ),
      ),
    }
  }),
)
