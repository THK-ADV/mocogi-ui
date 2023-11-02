import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleAtomic } from '../../types/module-atomic'

export const ModuleReviewsPageActions = createActionGroup({
  source: 'Module Reviews Page',
  events: {
    'Enter': emptyProps(),
  },
})

export const ModuleReviewsApiActions = createActionGroup({
  source: 'Module Reviews API',
  events: {
    'Retrieved Approvals Success': props<{ modules: ModuleAtomic[] }>(),
    'Retrieved Module Reviews Failure': props<{ error: Error }>(),
  },
})
