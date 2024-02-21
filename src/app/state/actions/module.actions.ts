import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Sort } from '@angular/material/sort'
import { ModuleView } from '../../types/module-view'

export const ModulePageActions = createActionGroup({
  source: 'Module Page',
  events: {
    'Enter': emptyProps(),
    'Select Module': props<{ moduleId: string }>(),
    'Filter Module': props<{ filter: string }>(),
    'Reset Filter': emptyProps(),
    'Select Sort': props<{ sort: Sort }>(),
  },
})

export const ModuleApiActions = createActionGroup({
  source: 'Module API',
  events: {
    'Retrieved Modules Success': props<{ modules: ModuleView[] }>(),
    'Retrieved Modules Failure': props<{ error: Error }>(),
  },
})
