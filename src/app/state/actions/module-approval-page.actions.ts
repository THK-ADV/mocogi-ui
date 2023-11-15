import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const ModuleApprovalPageActions = createActionGroup({
  source: 'Module Review Page',
  events: {
    'Enter': emptyProps(),
    'Approve': props<{ moduleId: string, approvalId: string, comment?: string }>(),
    'Reject': props<{ moduleId: string, approvalId: string, comment?: string }>(),
    'JumpToKey': props<{ key: string }>,
  },
})

export const ModuleApprovalApiActions = createActionGroup({
  source: 'Module Approval API',
  events: {
    'Module Approval Success': emptyProps(),
    'Module Approval Failed': props<{ error: Error }>(),
  },
})
