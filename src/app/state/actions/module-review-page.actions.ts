import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Sort } from '@angular/material/sort'
import { ModuleAtomic } from '../../types/module-atomic'

export const ModuleReviewPageActions = createActionGroup({
  source: 'Module Page',
  events: {
    'Enter': emptyProps(),
    'Select Module': props<{ moduleId: string }>(),
    'Filter Module': props<{ filter: string }>(),
    'Reset Filter': emptyProps(),
    'Select Sort': props<{ sort: Sort }>(),
  },
})

export const ModuleReviewApiActions = createActionGroup({
  source: 'Module API',
  events: {
    'Retrieved Modules Success': props<{ modules: ModuleAtomic[] }>(),
    'Retrieved Modules Failure': props<{ error: Error }>(),
  },
})
