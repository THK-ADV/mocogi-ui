import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Semester } from '../../types/module-compendium'

export const ElectivesCatalogsFilterComponentActions = createActionGroup({
  source: 'Electives Compendiums Filter Component',
  events: {
    'Enter': emptyProps(),
    'UpdateSearchQuery': props<{ searchQuery: string }>(),
    'Select Semester': props<{ semester: Semester }>(),
    'Deselect Semester': emptyProps(),
    'Reset Filter': emptyProps(),
  },
})

export const ElectivesCatalogsFilterAPIActions = createActionGroup({
  source: 'Module Compendiums Filter API',
  events: {
    'Retrieved Semesters Success': props<{ semesters: readonly Semester[] }>(),
  },
})
