import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleAtomic } from '../../types/module-atomic'

export const ModuleReviewsPageActions = createActionGroup({
  source: 'Module Reviews Page',
  events: {
    'Enter': emptyProps(),
    'Approve Module Review': props<{ moduleId: string, comment?: string }>(),
    'Request Change on Module Review': props<{ filter: string, comment?: string }>(),
  },
})

export const ModuleReviewsApiActions = createActionGroup({
  source: 'Module API',
  events: {
    'Retrieved Module Reviews Success': props<{ modules: ModuleAtomic[] }>(),
    'Retrieved Module Reviews Failure': props<{ error: Error }>(),
  },
})
