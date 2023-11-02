import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleAtomic } from '../../types/module-atomic'

export const ModuleApprovalPageActions = createActionGroup({
  source: 'Module Review Page',
  events: {
    'Enter': emptyProps(),
    'Approve': props<{ approvalId: string, comment?: string }>(),
    'Reject': props<{ approvalId: string, comment?: string }>(),
    'JumpToKey': props<{ key: string }>,
  },
})

export const ModuleReviewApiActions = createActionGroup({
  source: 'Module Review API',
  events: {
    'Retrieved Module Review Success': props<{ modules: ModuleAtomic[] }>(),
    'Retrieved Modules Review Failure': props<{ error: Error }>(),
  },
})
