import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleView } from '../../types/module-view'

export const ModuleApprovalsPageActions = createActionGroup({
  source: 'Module Reviews Page',
  events: {
    'Enter': emptyProps(),
  },
})

export const ModuleReviewsApiActions = createActionGroup({
  source: 'Module Reviews API',
  events: {
    'Retrieved Approvals Success': props<{ modules: ModuleView[] }>(),
    'Retrieved Module Reviews Failure': props<{ error: Error }>(),
  },
})
