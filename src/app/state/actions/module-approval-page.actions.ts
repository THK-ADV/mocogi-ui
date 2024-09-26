import { createActionGroup, props } from '@ngrx/store'

export const ModuleApprovalPageActions = createActionGroup({
  source: 'Module Review Page',
  events: {
    Approve: props<{
      moduleId: string
      approvalId: string
      comment?: string
    }>(),
    Reject: props<{ moduleId: string; approvalId: string; comment?: string }>(),
    JumpToKey: props<{ key: string }>,
  },
})
